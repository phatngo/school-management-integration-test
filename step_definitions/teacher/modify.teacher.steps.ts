import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { NUMBER } from "../../constants/types.constants";

When(
  "I modify the existing teacher with the following data:",
  async function (teacherProfile: { rawTable: string[][] }) {
    const data = await parseDataTable(teacherProfile.rawTable, this);
    const teacher = new TeacherApi(this.currentUser);
    const teacherId = this.seededTeacher.id;
    const payload = {
      name: data.name,
    };
    this.modifiedTeacher = await teacher.put(teacherId, payload);
  },
);

When(
  "I modify the teacher with id: {string} and the following data:",
  async function (teacherId: string, teacherProfile: { rawTable: string[][] }) {
    const data = await parseDataTable(teacherProfile.rawTable, this);
    const teacher = new TeacherApi(this.currentUser);
    const payload = {
      name: String(data.name),
    };
    this.modifiedTeacher = await teacher.put(teacherId, payload);
  },
);

Then(
  "I see the teacher is modified successfully with the following data:",
  async function (teacherProfile: { rawTable: string[][] }) {
    const expectedData = await parseDataTable(teacherProfile.rawTable, this);
    const { actualResponseCode, actualResponseBody } = this.modifiedTeacher;

    expect(actualResponseCode).to.equal(HTTP_STATUS.OK);
    assertResponseSchema(actualResponseBody, TEACHER_RESPONSE_SCHEMA_PATH);

    // Compare data in response with request body
    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(actualResponseBody.data.name).to.equal(expectedData.name);
    expect(actualResponseBody.data.id).to.be.a(NUMBER);

    // Check if the teacher is actually updated in the database
    const updatedTeacherInDb = await this.teacherDb.getById(
      actualResponseBody.data.id,
    );

    if (!updatedTeacherInDb) {
      throw new Error(
        `Teacher with id ${actualResponseBody.data.id} not found in the database`,
      );
    }

    expect(updatedTeacherInDb.name).to.equal(expectedData.name);
    expect(updatedTeacherInDb.id).to.equal(actualResponseBody.data.id);
  },
);

Then(
  "I fail to modify the teacher as the teacher with {string} is not found",
  async function (id: string) {
    const { actualResponseCode, actualResponseBody } = this.modifiedTeacher;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);

Then("I fail to modify the teacher as name is invalid", async function () {
  const { actualResponseCode, actualResponseBody } = this.modifiedTeacher;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid name!`,
  );
});
