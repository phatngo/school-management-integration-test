import { ApiClient } from "../clients/api.client";

export class ClassApi extends ApiClient {
  constructor(user?: { username: string; apiKey: string }) {
    super("/classes", user);
  }
}
