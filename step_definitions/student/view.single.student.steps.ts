import { Then, When } from "@cucumber/cucumber";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  HTTP_STATUS,
  RESPONSE_CODE,
  STUDENT_RESPONSE_SCHEMA_PATH,
} from "../../constants/api.constants";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import { expect } from "chai";
import { StudentApi } from "../../api/student.api";

When("I view the existing student", async function () {
  const existingStudentId = this.seededStudent.id;
  const studentApi = new StudentApi(this.currentUser);
  this.getStudent = await studentApi.get(existingStudentId);
});

When("I view the student with id: {string}", async function (studentId: string) {
  const studentApi = new StudentApi(this.currentUser);
  this.getStudent = await studentApi.get(studentId);
});

Then(
  "I see the student is fetched correctly with the following details:",
  async function (studentInfo: { rawTable: string[][] }) {
    // this = CustomWorld instance, which has properties like currentUser, studentDb, etc. that we can use in our step definitions.
    // Learn more in ./step_definitions/common/world.ts
    const expectedData = await parseDataTable(studentInfo.rawTable, this);
    const { actualResponseCode, actualResponseBody } = this.getStudent;

    expect(actualResponseCode).to.equal(HTTP_STATUS.OK);
    assertResponseSchema(actualResponseBody, STUDENT_RESPONSE_SCHEMA_PATH);

    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(actualResponseBody.data.id).to.equal(this.seededStudent.id);
    expect(actualResponseBody.data.name).to.equal(expectedData.name);
    expect(actualResponseBody.data.phone_number).to.equal(expectedData.phone_number);
    expect(actualResponseBody.data.class_id).to.equal(expectedData.class_id);

    const studentDataInDb = await this.studentDb.getById(actualResponseBody.data.id);

    expect(studentDataInDb.id).to.equal(this.seededStudent.id);
    expect(studentDataInDb.name).to.equal(expectedData.name);
    expect(studentDataInDb.phone_number).to.equal(expectedData.phone_number);
    expect(studentDataInDb.class_id).to.equal(expectedData.class_id);
  },
);

Then(
  "I fail to see the student as the student with id: {string} is not found",
  async function (studentId: string) {
    const { actualResponseCode, actualResponseBody } = this.getStudent;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `student with id: ${studentId} is not found`,
    );
  },
);
