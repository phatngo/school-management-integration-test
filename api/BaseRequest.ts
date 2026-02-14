import config from "config";
import { request, spec } from "pactum";

export class BaseRequest<T, U = null> {
  protected url: string;
  protected endpoint: string;
  protected method: string;
  protected requestHeaders: Record<string, string>;
  protected requestBody?: U | null;
  protected responseCode: number | null = null;
  protected responseBody?: T | null;
  protected user: {
    username: string;
    apiKey: string;
  } | null = null;

  constructor(
    endpoint: string,
    method: string,
    extraRequestHeaders: Record<string, string> | null = null,
    requestBody?: U | null,
    user: {
      username: string;
      apiKey: string;
    } | null = null,
    url: string = config.get("basePublicUrl"),
  ) {
    this.url = url;
    this.endpoint = endpoint;
    this.method = method;

    this.requestHeaders = extraRequestHeaders ? { ...extraRequestHeaders } : {};
    if (!this.requestHeaders["Content-Type"]) {
      this.requestHeaders["Content-Type"] = "application/json";
    }

    if (user) {
      this.user = { ...user };
    }

    if (requestBody) {
      this.requestBody = { ...requestBody };
    }

    request.setBaseUrl(this.url);
    Object.entries(this.requestHeaders).forEach(([key, value]) => {
      request.setDefaultHeaders(key, value);
    });

    this.user
      ? request.setBasicAuth(this.user.username, this.user.apiKey)
      : null;
  }

  async post() {
    return await spec().post(this.endpoint).withBody(this.requestBody);
  }

  async get(id: string) {
    return await spec().get(this.endpoint.concat(`/${id}`));
  }

  assertResponseCode(expectedCode: number) {
    spec().expectStatus(expectedCode);
  }
}
