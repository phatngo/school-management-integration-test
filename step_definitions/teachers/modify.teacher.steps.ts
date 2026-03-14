import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  getAddedTeacherId,
  parseDataTable,
} from "../../utils/cucumber.utils";
import {
  assertPutSuccess,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { TeacherRequestBody } from "../../types/api/teacher.api.types";

When(
  "I modify the added teacher with the following data:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const teacher = new TeacherApi(this.currentUser);
    const teacherId = getAddedTeacherId(this);
    const payload = {
      name: String(data.name),
    };
    this.modifiedTeacherResponse = await teacher.put(teacherId, payload);
  },
);

When(
  "I modify the teacher with id: {int} and the following data:",
  async function (teacherId: number, teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const teacher = new TeacherApi(this.currentUser);

    const payload = {
      name: String(data.name),
    };

    this.modifiedTeacherResponse = await teacher.put(teacherId, payload);
  },
);

Then("I see the teacher is modified successfully", async function () {
  assertPutSuccess<TeacherRequestBody>(
    this.modifiedTeacherResponse.payload,
    this.modifiedTeacherResponse.response,
    TEACHER_RESPONSE_SCHEMA_PATH,
  );

  const updatedTeacherInDb = await this.teacherDb.getById(
    this.modifiedTeacherResponse.response.body.data.id,
  );

  if (!updatedTeacherInDb) {
    throw new Error(
      `Teacher with id ${this.modifiedTeacherResponse.response.body.data.id} not found in the database`,
    );
  }

  expect(updatedTeacherInDb.name).to.equal(
    this.modifiedTeacherResponse.response.body.data.name,
  );
  expect(updatedTeacherInDb.id).to.equal(
    this.modifiedTeacherResponse.response.body.data.id,
  );
});

Then(
  "I fail to modify the teacher as the teacher with {int} is not found",
  async function (id: number) {
    return assertErrorResponse(
      this.modifiedTeacherResponse.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);

Then("I fail to modify the teacher as name cannot be empty", async function () {
  return assertErrorResponse(
    this.modifiedTeacherResponse.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `name should not be empty!`,
  );
});
