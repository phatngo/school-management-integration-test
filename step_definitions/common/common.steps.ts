import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { TeacherDBSchema } from "../../types/db/teacher.db.types";
import { parseDataTable } from "../../utils/cucumber.utils";
import { ClassDBSchema } from "../../types/db/class.db.types";
import { StudentDBSchema } from "../../types/db/student.db.types";

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
    const data = await parseDataTable(teacherProfile.rawTable, this);
    const insertId = await this.teacherDb.insert(data);
    if (insertId) {
      this.seededTeacher = { id: insertId, ...data } as TeacherDBSchema;
    } else {
      throw new Error("Failed to seed teacher data in the database");
    }
  },
);

// Used for seeding data in the database, not for making API calls
Given(
  "a class with the following information has existed in the system:",
  async function (classInfo: { rawTable: [][] }) {
    const data = await parseDataTable(classInfo.rawTable, this);
    const insertId = await this.classDb.insert(data);
    if (insertId) {
      this.seededClass = { id: insertId, ...data } as ClassDBSchema;
    } else {
      throw new Error("Failed to seed class data in the database");
    }
  },
);

// Used for seeding data in the database, not for making API calls
Given(
  "a student with the following information has existed in the system:",
  async function (studentInfo: { rawTable: [][] }) {
    const data = await parseDataTable(studentInfo.rawTable, this);
    const insertId = await this.studentDb.insert(data);
    if (insertId) {
      this.seededStudent = { id: insertId, ...data } as StudentDBSchema;
    } else {
      throw new Error("Failed to seed student data in the database");
    }
  },
);
