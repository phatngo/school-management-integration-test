import { ApiClient } from "../clients/api.client";

export class StudentApi extends ApiClient {
  constructor(user?: { username: string; apiKey: string }) {
    super("/students", user);
  }
}
