// requests/GetStudentRequest.ts
import { BaseService } from "./base.service";
import {
  StudentResponseData,
  StudentRequestBody,
} from "../types/api/student.api.types";
import { Response } from "../types/api/common.api.types";

export class StudentService extends BaseService<
  Response<StudentResponseData>,
  StudentRequestBody
> {
  constructor(user?: { username: string; apiKey: string }) {
    super("/students", user);
  }
}
