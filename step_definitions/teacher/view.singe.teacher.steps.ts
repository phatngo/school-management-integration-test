import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { parseDataTable } from "../../utils/cucumber.utils";

When("I view the existing teacher", async function () {
  const teacher = new TeacherApi(this.currentUser);
  const teacherId = this.seededTeacher.id;
  this.getTeacher = await teacher.get(teacherId);
});

When(
  "I view the teacher with id: {string}",
  async function (teacherId: string) {
    const teacher = new TeacherApi(this.currentUser);
    this.getTeacher = await teacher.get(teacherId);
  },
);

Then(
  "I see the existing teacher is fectched successfully with the following profile:",
  async function (teacherProfile: { rawTable: string[][] }) {
    const expectedData = await parseDataTable(teacherProfile.rawTable, this);
    const { actualResponseCode, actualResponseBody } = this.getTeacher;

    expect(actualResponseCode).to.equal(HTTP_STATUS.OK);
    assertResponseSchema(actualResponseBody, TEACHER_RESPONSE_SCHEMA_PATH);

    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(actualResponseBody.data.name).to.equal(expectedData.name);
    expect(actualResponseBody.data.id).to.equal(this.seededTeacher.id);
  },
);

Then(
  "I fail to view the teacher as the teacher with {string} is not found",
  async function (id: string) {
    const { actualResponseCode, actualResponseBody } = this.getTeacher;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);
