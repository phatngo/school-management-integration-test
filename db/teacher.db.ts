import { DBClient } from "../clients/db.client";

export class TeacherDb extends DBClient {
  constructor() {
    super("teacher");
  }
}
