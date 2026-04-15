import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { TeacherRequestBody } from "../../types/api/teacher.api.types";
import { RequestInfo } from "../../types/api/common.api.types";

When(
  "I modify the existing teacher with the following data:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = await parseDataTable(teacherProfile.rawTable);
    const teacher = new TeacherApi(this.currentUser);
    const teacherId = this.seededTeacher.id;
    const payload = {
      name: data.name,
    };
    const modifiedTeacher: RequestInfo<TeacherRequestBody> = await teacher.put(
      teacherId,
      payload,
    );
    this.modifiedTeacher = modifiedTeacher;
  },
);

When(
  "I modify the teacher with id: {string} and the following data:",
  async function (teacherId: string, teacherProfile: { rawTable: [][] }) {
    const data = await parseDataTable(teacherProfile.rawTable);
    const teacher = new TeacherApi(this.currentUser);

    const payload = {
      name: String(data.name),
    };

    const modifiedTeacher: RequestInfo<TeacherRequestBody> = await teacher.put(
      teacherId,
      payload,
    );
    this.modifiedTeacher = modifiedTeacher;
  },
);

Then(
  "I see the teacher is modified successfully with the following data:",
  async function (teacherProfile: { rawTable: [][] }) {
    const expectedData = await parseDataTable(teacherProfile.rawTable);
    assertCommon(
      TEACHER_RESPONSE_SCHEMA_PATH,
      this.modifiedTeacher.response,
      HTTP_STATUS.OK,
    );

    const responseBody = this.modifiedTeacher.response.body;

    // Compare data in response with request body
    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.name).to.equal(expectedData.name);
    expect(responseBody.data.id).to.be.a("number");

    // Check if the teacher is actually updated in the database
    const updatedTeacherInDb = await this.teacherDb.getById(
      responseBody.data.id,
    );

    if (!updatedTeacherInDb) {
      throw new Error(
        `Teacher with id ${responseBody.data.id} not found in the database`,
      );
    }

    expect(updatedTeacherInDb.name).to.equal(expectedData.name);
    expect(updatedTeacherInDb.id).to.equal(responseBody.data.id);
  },
);

Then(
  "I fail to modify the teacher as the teacher with {string} is not found",
  async function (id: string) {
    return assertErrorResponse(
      this.modifiedTeacher.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);

Then("I fail to modify the teacher as name is invalid", async function () {
  return assertErrorResponse(
    this.modifiedTeacher.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid name!`,
  );
});
