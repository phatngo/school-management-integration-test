import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { TeacherDBSchema } from "../../types/db/teacher.db.types";
import { parseDataTable } from "../../utils/cucumber.utils";

Given(
  "I am authenticated as {string} user",
  async function (this: CustomWorld, user: string) {
    this.chooseUser(user);
  },
);

// Used for seeding data in the database, not for making API calls
Given(
  "a teacher with the following profile has existed in the system:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const insertId = await this.teacherDb.insert(data);
    if (insertId) {
      this.seededTeacher = { id: insertId, ...data } as TeacherDBSchema;
    } else {
      throw new Error("Failed to seed teacher data in the database");
    }
  },
);