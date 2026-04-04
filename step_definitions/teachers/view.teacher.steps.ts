import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { RequestInfo } from "../../types/api/common.api.types";
import { parseDataTable } from "../../utils/cucumber.utils";

When("I view the existing teacher", async function () {
  const teacher = new TeacherApi(this.currentUser);
  const teacherId = this.seededTeacher.id;
  const getTeacher: RequestInfo = await teacher.get(teacherId);
  this.getTeacher = getTeacher;
});

When(
  "I view the teacher with id: {string}",
  async function (teacherId: string) {
    const teacher = new TeacherApi(this.currentUser);
    const getTeacher: RequestInfo = await teacher.get(teacherId);
    this.getTeacher = getTeacher;
  },
);

Then(
  "I see the existing teacher is fectched successfully with the following profile:",
  async function (teacherProfile: { rawTable: string }) {
    const expectedData = parseDataTable(teacherProfile.rawTable);
    assertCommon(
      TEACHER_RESPONSE_SCHEMA_PATH,
      this.getTeacher.response,
      HTTP_STATUS.OK,
    );

    const getResponseBody = this.getTeacher.response.body;

    expect(getResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(getResponseBody.data.name).to.equal(expectedData.name);
    expect(getResponseBody.data.id).to.equal(this.seededTeacher.id);
  },
);

Then(
  "I fail to view the teacher as the teacher with {string} is not found",
  async function (id: string) {
    return assertErrorResponse(
      this.getTeacher.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);
