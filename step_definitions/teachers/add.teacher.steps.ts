import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  TeacherRequestBody,
  TeacherResponseData,
} from "../../types/api/teacher.api.types";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  assertPostSuccess,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { TeacherDBSchema } from "../../types/db/teacher.db.types";
import { expect } from "chai";
import Spec from "pactum/src/models/Spec";

When(
  "I add a new teacher with the following profile:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const payload: TeacherRequestBody = {
      name: String(data.name),
    };
    const teacher = new TeacherApi(this.currentUser);
    this.addedTeacher = await teacher.post(payload);
  },
);

Then("I see the teacher is created successfully", async function () {
  assertPostSuccess<TeacherRequestBody, Spec>(
    this.addedTeacher.payload,
    this.addedTeacher.response,
    TEACHER_RESPONSE_SCHEMA_PATH,
  );
  const teacherDataInDb: TeacherDBSchema = await this.teacherDb.getById(
    this.addedTeacher.response.body.data.id,
  );

  expect(teacherDataInDb.name).to.equal(
    this.addedTeacher.response.body.data.name,
  );
  expect(teacherDataInDb.id).to.equal(this.addedTeacher.response.body.data.id);
});

Then("I fail to add the teacher as name cannot be empty", async function () {
  return assertErrorResponse(
    this.addedTeacher.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `name should not be empty!`,
  );
});
