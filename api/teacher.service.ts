// requests/GetStudentRequest.ts
import { BaseService } from "./base.service";
import {
  TeacherResponseBody,
  TeacherRequestBody,
} from "../types/api/teacher.api.types";

export class TeacherService extends BaseService<
  TeacherResponseBody,
  TeacherRequestBody
> {
  constructor(user?: { username: string; apiKey: string }) {
    super("/teachers", user);
  }
}
