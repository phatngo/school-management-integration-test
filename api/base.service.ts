import config from "config";
import { spec } from "pactum";
import Spec from "pactum/src/models/Spec";
import { PaginatedResponse, Response } from "../types/api/common.api.types";

// T = Response Body Type, U = Request Body Type
export class BaseService<T, U = null> {
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

  post(body: U): Spec {
    return this.createSpec()
      .post(`${this.baseUrl}${this.endpoint}`)
      .withBody(body);
  }

  async get(id?: number): Promise<Response<T>> {
    const path = id ? `${this.endpoint}/${id}` : this.endpoint;
    return await this.createSpec()
      .get(`${this.baseUrl}${path}`)
      .returns("res.body");
  }

  async list(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<T>> {
    const path = params
      ? `?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : "";
    return await this.createSpec()
      .get(`${this.baseUrl}${path}`)
      .returns("res.body");
  }

  async delete(id: number): Promise<Response<T>> {
    const path = id ? `/${this.endpoint}/${id}` : this.endpoint;
    return await this.createSpec()
      .delete(`${this.baseUrl}${path}`)
      .returns("res.body");
  }
}
