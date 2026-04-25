import { Then, When } from "@cucumber/cucumber";
import { parseDataTable } from "../../utils/cucumber.utils";
import {
  HTTP_STATUS,
  RESPONSE_CODE,
  STUDENT_RESPONSE_SCHEMA_PATH,
} from "../../constants/api.constants";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { expect } from "chai";
import { StudentApi } from "../../api/student.api";

When("I view the existing student", async function () {
  const existingStudentId = this.seededStudent.id;
  const studentApi = new StudentApi(this.currentUser);

  const getStudent = await studentApi.get(existingStudentId);
  this.getStudent = getStudent;
});

When("I view the student with id: {string}", async function (studentId: string) {
  const studentApi = new StudentApi(this.currentUser);

  const getStudent = await studentApi.get(studentId);
  this.getStudent = getStudent;
});

Then(
  "I see the student is fetched correctly with the following details:",
  async function (studentInfo: { rawTable: string[][] }) {
    // this = CustomWorld instance, which has properties like currentUser, studentDb, etc. that we can use in our step definitions.
    // Learn more in ./step_definitions/common/world.ts
    const expectedData = await parseDataTable(studentInfo.rawTable, this);

    assertCommon(
      STUDENT_RESPONSE_SCHEMA_PATH,
      this.getStudent.response,
      HTTP_STATUS.OK,
    );

    const responseBody = this.getStudent.response.body;

    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.id).to.equal(this.seededStudent.id);
    expect(responseBody.data.name).to.equal(expectedData.name);
    expect(responseBody.data.class_type).to.equal(expectedData.class_type);
    expect(responseBody.data.teacher_id).to.equal(expectedData.teacher_id);

    const studentDataInDb = await this.studentDb.getById(responseBody.data.id);

    expect(studentDataInDb.id).to.equal(this.seededStudent.id);
    expect(studentDataInDb.name).to.equal(expectedData.name);
    expect(studentDataInDb.class_type).to.equal(expectedData.class_type);
    expect(studentDataInDb.teacher_id).to.equal(expectedData.teacher_id);
  },
);

Then(
  "I fail to see the student as the student with id: {string} is not found",
  async function (studentId: string) {
    assertErrorResponse(
      this.getStudent.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `student with id: ${studentId} is not found`,
    );
  },
);
