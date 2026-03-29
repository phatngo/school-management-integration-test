import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import { getAddedTeacherId } from "../../utils/cucumber.utils";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";

When("I view the added teacher", async function () {
  const teacher = new TeacherApi(this.currentUser);
  const teacherId = getAddedTeacherId(this);
  this.getTeacher = await teacher.get(teacherId);
});

When("I view the teacher with id: {int}", async function (teacherId: number) {
  const teacher = new TeacherApi(this.currentUser);
  this.getTeacher = await teacher.get(teacherId);
});

Then(
  "I see the fetched teacher data matches the data when created",
  async function () {
    assertCommon(
      TEACHER_RESPONSE_SCHEMA_PATH,
      this.getTeacher.response,
      HTTP_STATUS.OK,
    );

    const getResponseBody = this.getTeacher.response.body;
    const postResponseBody = this.addedTeacher.response.body;

    // Compare data in response with data when created
    expect(getResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(getResponseBody.data.name).to.equal(
      postResponseBody.data.name,
    );
    expect(getResponseBody.data.id).to.equal(
      postResponseBody.data.id,
    );
  },
);

Then(
  "I fail to view the teacher as the teacher with {int} is not found",
  async function (id: number) {
    return assertErrorResponse(
      this.getTeacher.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);
