// requests/GetStudentRequest.ts
import { ApiClient } from "../clients/api.client";

export class StudentApi extends ApiClient<any> {
  constructor(user?: { username: string; apiKey: string }) {
    super("/students", user);
  }
}
