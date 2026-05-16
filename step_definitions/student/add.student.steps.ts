import { When, Then } from "@cucumber/cucumber";
import { StudentApi } from "../../api/student.api";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import {
  STUDENT_RESPONSE_SCHEMA_PATH,
  HTTP_STATUS,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import { expect } from "chai";
import { NUMBER } from "../../constants/types.constants";

When(
  "I add a new student with the following profile:",
  async function (studentProfile: { rawTable: string[][] }) {
    const parsedStudentProfile = await parseDataTable(
      studentProfile.rawTable,
      this,
    );
    this.addStudent = await new StudentApi(this.currentUser).post(
      parsedStudentProfile,
    );
  },
);

Then(
  "I see the student is added successfully with the following profile:",
  async function (studentProfile: { rawTable: string[][] }) {
    const expectedData = await parseDataTable(studentProfile.rawTable, this);
    const { actualResponseCode, actualResponseBody } = this.addStudent;

    expect(actualResponseCode).to.equal(HTTP_STATUS.CREATED);
    assertResponseSchema(actualResponseBody, STUDENT_RESPONSE_SCHEMA_PATH);

    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.CREATED);
    expect(actualResponseBody.data.id).to.be.a(NUMBER);
    expect(actualResponseBody.data.name).to.equal(expectedData.name);
    expect(actualResponseBody.data.phone_number).to.equal(
      expectedData.phone_number,
    );
    expect(actualResponseBody.data.class_id).to.equal(expectedData.class_id);

    const studentProfileInDb = await this.studentDb.getById(
      actualResponseBody.data.id,
    );
    expect(studentProfileInDb.id).to.equal(actualResponseBody.data.id);
    expect(studentProfileInDb.name).to.equal(expectedData.name);
    expect(studentProfileInDb.phone_number).to.equal(expectedData.phone_number);
    expect(studentProfileInDb.class_id).to.equal(expectedData.class_id);
  },
);

Then("I fail to add the student as student name should be string", function () {
  const { actualResponseCode, actualResponseBody } = this.addStudent;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "name should be string!",
  );
});

Then("I fail to add the student as phone number should be string", function () {
  const { actualResponseCode, actualResponseBody } = this.addStudent;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "phone number should be string!",
  );
});

Then(
  "I fail to add the student as class with id: {int} is not existing",
  function (classId: number) {
    const { actualResponseCode, actualResponseBody } = this.addStudent;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `class with id: ${classId} is not found`,
    );
  },
);
