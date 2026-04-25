import { When, Then } from "@cucumber/cucumber";
import { StudentApi } from "../../api/student.api";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import {
  STUDENT_RESPONSE_SCHEMA_PATH,
  HTTP_STATUS,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import { expect } from "chai";

When(
  "I add a new student with the following profile:",
  async function (studentProfile: { rawTable: string[][] }) {
    const parsedStudentProfile = await parseDataTable(
      studentProfile.rawTable,
      this,
    );
    const addStudent = await new StudentApi(this.currentUser).post(
      parsedStudentProfile,
    );
    this.addStudent = addStudent;
  },
);

Then(
  "I see the student is added successfully with the following profile:",
  async function (studentProfile: { rawTable: string[][] }) {
    const expectedData = await parseDataTable(studentProfile.rawTable, this);
    const response = this.addStudent.response;
    const responseBody = response.body;
    assertCommon(STUDENT_RESPONSE_SCHEMA_PATH, response, HTTP_STATUS.CREATED);

    expect(responseBody.code).to.equal(RESPONSE_CODE.CREATED);
    expect(responseBody.data.id).to.be.a("number");
    expect(responseBody.data.name).to.equal(expectedData.name);
    expect(responseBody.data.phone_number).to.equal(expectedData.phone_number);
    expect(responseBody.data.class_id).to.equal(expectedData.class_id);

    const studentProfileInDb = await this.studentDb.getById(
      responseBody.data.id,
    );
    expect(studentProfileInDb.id).to.equal(responseBody.data.id);
    expect(studentProfileInDb.name).to.equal(expectedData.name);
    expect(studentProfileInDb.phone_number).to.equal(expectedData.phone_number);
    expect(studentProfileInDb.class_id).to.equal(expectedData.class_id);
  },
);

Then("I fail to add the student as student name should be string", function () {
  return assertErrorResponse(
    this.addStudent.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "name should be string!",
  );
});

Then("I fail to add the student as phone number should be string", function () {
  return assertErrorResponse(
    this.addStudent.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "phone number should be string!",
  );
});

Then(
  "I fail to add the student as class with id: {int} is not existing",
  function (classId: number) {
    return assertErrorResponse(
      this.addStudent.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `class with id: ${classId} is not found`,
    );
  },
);
