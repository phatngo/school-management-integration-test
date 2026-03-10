import { DBClient } from "../clients/db.client";
import { TeacherDBSchema } from "../types/db/teacher.db.types";

export class TeacherDb extends DBClient<TeacherDBSchema> {
  constructor() {
    super("teacher");
  }
}
