import { When, Then } from "@cucumber/cucumber";
import { getAddedTeacherId } from "../../utils/cucumber.utils";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";

When("I delete the added teacher", async function () {
  const teacher = new TeacherApi(this.currentUser);
  const teacherId = getAddedTeacherId(this);
  this.deleteTeacher = await teacher.delete(teacherId);
});

When("I delete the teacher with id: {int}", async function (id: number) {
  const teacher = new TeacherApi(this.currentUser);
  this.deleteTeacher = await teacher.delete(id);
});

Then("I see the teacher is deleted successfully", async function () {
  assertCommon(
    null,
    this.deleteTeacher.response,
    HTTP_STATUS.NO_CONTENT,
  );

  // Check if the teacher is actually removed from the database
  const teacherId = getAddedTeacherId(this);

  const removedTeacherData = await this.teacherDb.getById(teacherId);

  if (removedTeacherData) {
    throw new Error(
      `Teacher with id ${teacherId} still exists in the database after deletion`,
    );
  }
});

Then(
  "I fail to delete the teacher as the teacher with {int} is not found",
  async function (id: number) {
    return assertErrorResponse(
      this.deleteTeacher.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);
