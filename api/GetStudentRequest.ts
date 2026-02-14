import { HttpMethods } from "../constants/enums/http-methods.enum";
import { Student } from "../types/api/student.api.schema";
import { BaseRequest } from "./BaseRequest";

export class GetStudentRequest extends BaseRequest<Student> {
  constructor(user: { username: string; apiKey: string }) {
    super(
      "/students",
      HttpMethods.GET,
      { "Content-Type": "application/json" },
      null,
      user,
    );
  }
}
