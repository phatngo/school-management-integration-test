import { DBClient } from "../clients/db.client";
import { TeacherDBSchema } from "../types/db/teacher.db.types";
import { ClassDBSchema } from "../types/db/class.db.types";

export class ClassDb extends DBClient<ClassDBSchema> {
  constructor() {
    super("classroom");
  }
}
