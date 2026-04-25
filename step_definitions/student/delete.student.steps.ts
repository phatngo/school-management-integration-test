import { Then, When } from "@cucumber/cucumber";
import { StudentApi } from "../../api/student.api";
import {
  HTTP_STATUS,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { expect } from "chai";

When("I delete the existing student", async function () {
  const existingStudentId = this.seededStudent.id;
  const studentApi = new StudentApi(this.currentUser);

  const getStudent = await studentApi.delete(existingStudentId);
  this.deletedStudent = getStudent;
});

When(
  "I delete the student with id: {string}",
  async function (studentId: string) {
    const studentApi = new StudentApi(this.currentUser);

    const getStudent = await studentApi.delete(studentId);
    this.deletedStudent = getStudent;
  },
);

Then("I see the student is deleted successfully", async function () {
  assertCommon(null, this.deletedStudent.response, HTTP_STATUS.NO_CONTENT);
  const studentDataInDb = await this.studentDb.getById(this.seededStudent.id);
  expect(studentDataInDb).to.be.null;
});

Then(
  "I fail to delete the student with id: {string} is not found",
  async function (studentId: string) {
    assertErrorResponse(
      this.deletedStudent.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `student with id: ${studentId} is not found`,
    );
  },
);
