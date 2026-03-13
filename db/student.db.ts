import { DBClient } from "../clients/db.client";
import { StudentDBSchema } from "../types/db/student.db.types";

export class StudentDb extends DBClient<StudentDBSchema> {
  constructor() {
    super("student");
  }
}
