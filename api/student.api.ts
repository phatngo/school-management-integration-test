// requests/GetStudentRequest.ts
import { ApiClient } from "../clients/api.client";
import { StudentRequestBody } from "../types/api/student.api.types";

export class StudentApi extends ApiClient<StudentRequestBody> {
  constructor(user?: { username: string; apiKey: string }) {
    super("/students", user);
  }
}
