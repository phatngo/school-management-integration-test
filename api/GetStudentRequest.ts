import { HttpMethods } from "../constants/enums/http-methods.enum";
import { User } from "../types/api/common.api.schema";
import { Student } from "../types/api/student.api.schema";
import { BaseRequest } from "./BaseRequest";

export class GetStudentRequest extends BaseRequest<Student> {
  constructor(user: User) {
    super("/students", HttpMethods.GET, null, null, user);
  }
}
