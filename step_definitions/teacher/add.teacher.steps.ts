import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { TeacherDBSchema } from "../../types/db/teacher.db.types";
import { expect } from "chai";
import { NUMBER } from "../../constants/types.constants";

When(
  "I add a new teacher with the following profile:",
  async function (teacherProfile: { rawTable: string[][] }) {
    const data = await parseDataTable(teacherProfile.rawTable, this);
    const payload = {
      name: data.name,
    };
    const addedTeacher = await new TeacherApi(this.currentUser).post(payload);
    this.addedTeacher = addedTeacher;
  },
);

Then(
  "I see the teacher is created successfully with the following profile:",
  async function (teacherProfile: { rawTable: string[][] }) {
    const expectedData = await parseDataTable(teacherProfile.rawTable, this);
    const { actualResponseCode, actualResponseBody } = this.addedTeacher;

    expect(actualResponseCode).to.equal(HTTP_STATUS.CREATED);
    assertResponseSchema(actualResponseBody, TEACHER_RESPONSE_SCHEMA_PATH);

    // Compare data in response with request body
    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.CREATED);
    expect(actualResponseBody.data.name).to.equal(expectedData.name);
    expect(actualResponseBody.data.id).to.be.a(NUMBER);

    // Check if the teacher is actually added in the database
    const teacherDataInDb: TeacherDBSchema = await this.teacherDb.getById(
      actualResponseBody.data.id,
    );

    expect(teacherDataInDb.name).to.equal(expectedData.name);
    expect(teacherDataInDb.id).to.equal(actualResponseBody.data.id);
  },
);

Then("I fail to add the teacher as name is invalid", async function () {
  const { actualResponseCode, actualResponseBody } = this.addedTeacher;

  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid name!`,
  );
});
