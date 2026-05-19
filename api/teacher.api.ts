import { ApiClient } from "../clients/api.client";

export class TeacherApi extends ApiClient {
  constructor(user?: { username: string; apiKey: string }) {
    super("/teachers", user);
  }
}
