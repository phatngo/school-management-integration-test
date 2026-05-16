import config from "config";
import { spec } from "pactum";
import {
  PactResponse,
  ListOptions,
  ParsedApiData,
} from "../types/api/common.api.types";
import { logApiRequestInfo } from "../utils/logger.utils";
import { HTTP_METHOD } from "../constants/api.constants";

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

  async post(body: T): Promise<ParsedApiData<T>> {
    const pactResponse: PactResponse = await this.createSpec()
      .post(`${this.baseUrl}${this.endpoint}`)
      .withBody(body);
    const parsedApiData = this.getParsedApiData(pactResponse);
    logApiRequestInfo(
      HTTP_METHOD.POST,
      this.endpoint,
      parsedApiData.actualResponseCode,
      parsedApiData.actualResponseBody,
      body,
    );
    return parsedApiData;
  }

  async put(id: string, body: T): Promise<ParsedApiData<T>> {
    const path = this.getPathWithId(id);
    const pactResponse: PactResponse = await this.createSpec()
      .put(`${this.baseUrl}${path}`)
      .withBody(body);
    const parsedApiData = this.getParsedApiData(pactResponse);
    logApiRequestInfo(
      HTTP_METHOD.PUT,
      path,
      parsedApiData.actualResponseCode,
      parsedApiData.actualResponseBody,
      body,
    );
    return parsedApiData;
  }

  async get(id?: string): Promise<ParsedApiData<T>> {
    const path = this.getPathWithId(id);
    const pactResponse: PactResponse = await this.createSpec().get(
      `${this.baseUrl}${path}`,
    );
    const parsedApiData = this.getParsedApiData(pactResponse);
    logApiRequestInfo(
      HTTP_METHOD.GET,
      path,
      parsedApiData.actualResponseCode,
      parsedApiData.actualResponseBody,
    );
    return parsedApiData;
  }

  async list(params?: ListOptions): Promise<ParsedApiData<T>> {
    const path = params
      ? `${this.endpoint}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : this.endpoint;
    const pactResponse: PactResponse = await this.createSpec().get(
      `${this.baseUrl}${path}`,
    );
    const parsedApiData = this.getParsedApiData(pactResponse);
    logApiRequestInfo(
      HTTP_METHOD.GET,
      path,
      parsedApiData.actualResponseCode,
      parsedApiData.actualResponseBody,
    );
    return parsedApiData;
  }

  async delete(id?: string): Promise<ParsedApiData<T>> {
    const path = this.getPathWithId(id);
    const pactResponse: PactResponse = await this.createSpec().delete(
      `${this.baseUrl}${path}`,
    );
    const parsedApiData = this.getParsedApiData(pactResponse);
    logApiRequestInfo(
      HTTP_METHOD.DELETE,
      path,
      parsedApiData.actualResponseCode,
      parsedApiData.actualResponseBody,
    );
    return parsedApiData;
  }

  getPathWithId(id?: string) {
    return id ? `${this.endpoint}/${id}` : this.endpoint;
  }

  getParsedApiData(response: PactResponse): ParsedApiData<T> {
    return {
      actualResponseCode: response.statusCode,
      actualResponseHeaders: response.headers,
      actualResponseBody: response.body,
    };
  }
}
