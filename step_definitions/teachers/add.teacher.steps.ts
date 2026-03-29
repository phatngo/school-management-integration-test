import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  TeacherRequestBody,
} from "../../types/api/teacher.api.types";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  assertErrorResponse,
  assertCommon,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { TeacherDBSchema } from "../../types/db/teacher.db.types";
import { expect } from "chai";

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
  assertCommon(TEACHER_RESPONSE_SCHEMA_PATH, this.addedTeacher.response, HTTP_STATUS.CREATED);

  const responseBody = this.addedTeacher.response.body;
  const requestbody = this.addedTeacher.body;

  // Compare data in response with request body
  expect(responseBody.code).to.equal(RESPONSE_CODE.CREATED);
  expect(responseBody.data.name).to.equal(requestbody.name);
  expect(responseBody.data.id).to.be.a("number");

  // Check if the teacher is actually added in the database
  const teacherDataInDb: TeacherDBSchema = await this.teacherDb.getById(
    responseBody.data.id,
  );

  expect(teacherDataInDb.name).to.equal(
    responseBody.data.name,
  );
  expect(teacherDataInDb.id).to.equal(responseBody.data.id);
});

Then("I fail to add the teacher as name cannot be empty", async function () {
  return assertErrorResponse(
    this.addedTeacher.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `name should not be empty!`,
  );
});
