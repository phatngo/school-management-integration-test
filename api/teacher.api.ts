// requests/GetStudentRequest.ts
import { ApiClient } from "../clients/api.client";
import {
  TeacherRequestBody,
} from "../types/api/teacher.api.types";

export class TeacherApi extends ApiClient<any> {
  constructor(user?: { username: string; apiKey: string }) {
    super("/teachers", user);
  }
}
