import config from "config";
import { spec } from "pactum";
import Spec from "pactum/src/models/Spec";
import { SpecResponse } from "../types/api/common.api.types";

/**
 * T = Response Body Type
 * U = Request Body Type
 */
export class ApiClient<T = null> {
  protected baseUrl: string;
  protected endpoint: string;
  protected headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  protected user: { username: string; apiKey: string } | null = null;

  constructor(
    endpoint: string,
    user?: { username: string; apiKey: string } | null,
  ) {
    this.endpoint = endpoint;
    this.baseUrl = config.get("baseKongUrl");
    if (user) this.user = user;
  }

  /**
   * Returns a fresh Pactum spec with base configuration already applied.
   * This avoids global state pollution.
   */
  protected createSpec() {
    const s = spec();

    // Set instance-specific config instead of global 'request'
    s.withHeaders(this.headers);

    if (this.user) {
      s.withAuth(this.user.username, this.user.apiKey);
    }

    return s;
  }

  async post(body: T): Promise<SpecResponse<T>> {
    const response = await this.createSpec()
      .post(`${this.baseUrl}${this.endpoint}`)
      .withBody(body);
    return { body, response };
  }

  async put(id: number, body: T): Promise<SpecResponse<T>> {
    const path = id ? `${this.endpoint}/${id}` : this.endpoint;
    const response = await this.createSpec()
      .put(`${this.baseUrl}${path}`)
      .withBody(body);
    return { body, response };
  }

  async get(id?: number): Promise<SpecResponse<null>> {
    const path = id ? `${this.endpoint}/${id}` : this.endpoint;
    const response = await this.createSpec().get(`${this.baseUrl}${path}`);
    return { response };
  }

  async list(params?: {
    page?: number;
    limit?: number;
  }): Promise<SpecResponse<null>> {
    const path = params
      ? `?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : "";
    const response = await this.createSpec().get(`${this.baseUrl}${path}`);
    return { response };
  }

  async delete(id: number): Promise<SpecResponse<null>> {
    const path = id ? `${this.endpoint}/${id}` : this.endpoint;
    const response = await this.createSpec().delete(`${this.baseUrl}${path}`);
    return { response };
  }
}
