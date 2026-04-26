import { Then, When } from "@cucumber/cucumber";
import { parseDataTable } from "../../utils/cucumber.utils";
import { StudentApi } from "../../api/student.api";
import {
  STUDENT_RESPONSE_SCHEMA_PATH,
  HTTP_STATUS,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { expect } from "chai";

When(
  "I modify the existing student with the following profile:",
  async function (studentProfile: { rawTable: [][] }) {
    const parsedData = await parseDataTable(studentProfile.rawTable, this);
    const payload = {
      name: parsedData.name,
      phone_number: parsedData.phone_number,
      class_id: parsedData.class_id,
    };
    const studentApi = new StudentApi(this.currentUser);
    const modifiedStudent = await studentApi.put(this.seededStudent.id, payload);
    this.modifiedStudent = modifiedStudent;
  },
);

When(
  "I modify the student with id: {string} with the following profile:",
  async function (studentId: string, studentProfile: { rawTable: [][] }) {
    const parsedData = await parseDataTable(studentProfile.rawTable, this);
    const payload = {
      name: parsedData.name,
      phone_number: parsedData.phone_number,
      class_id: parsedData.class_id,
    };
    const studentApi = new StudentApi(this.currentUser);
    const modifiedStudent = await studentApi.put(studentId, payload);
    this.modifiedStudent = modifiedStudent;
  },
);

Then(
  "I see the student is modified successfully with the following profile:",
  async function (studentProfile: { rawTable: [][] }) {
    const expectedData = await parseDataTable(studentProfile.rawTable, this);
    assertCommon(
      STUDENT_RESPONSE_SCHEMA_PATH,
      this.modifiedStudent.response,
      HTTP_STATUS.OK,
    );

    const responseBody = this.modifiedStudent.response.body;

    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.id).to.be.a("number");
    expect(responseBody.data.name).to.equal(expectedData.name);
    expect(responseBody.data.phone_number).to.equal(expectedData.phone_number);
    expect(responseBody.data.class_id).to.equal(expectedData.class_id);

    const studentDataInDb = await this.studentDb.getById(responseBody.data.id);
    expect(studentDataInDb.id).to.equal(responseBody.data.id);
    expect(studentDataInDb.name).to.equal(expectedData.name);
    expect(studentDataInDb.phone_number).to.equal(expectedData.phone_number);
    expect(studentDataInDb.class_id).to.equal(expectedData.class_id);
  },
);

Then(
  "I fail to modify the student as student with id: {string} is not found",
  function (studentId: string) {
    return assertErrorResponse(
      this.modifiedStudent.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `student with id: ${studentId} is not found`,
    );
  },
);

Then("I fail to modify the student as name should not be empty", function () {
  return assertErrorResponse(
    this.modifiedStudent.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "name should not be empty!",
  );
});

Then("I fail to modify the student as name should be string", function () {
  return assertErrorResponse(
    this.modifiedStudent.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "name should be string!",
  );
});

Then(
  "I fail to modify the student as phone number should not be empty",
  function () {
    return assertErrorResponse(
      this.modifiedStudent.response,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      "phone number should not be empty!",
    );
  },
);

Then("I fail to modify the student as class_id should be number", function () {
  return assertErrorResponse(
    this.modifiedStudent.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "class_id should be number!",
  );
});

Then(
  "I fail to modify the student as class with id: {int} is not found",
  function (classId: number) {
    return assertErrorResponse(
      this.modifiedStudent.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `class with id: ${classId} is not found`,
    );
  },
);
