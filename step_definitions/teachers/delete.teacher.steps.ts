import { When, Then } from "@cucumber/cucumber";
import {
  getAddedTeacherId,
  getTeacherService,
} from "../../utils/cucumber.utils";
import {
  assertDeleteSuccess,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import Spec from "pactum/src/models/Spec";

When("I delete the added teacher", async function () {
  const teacher = new TeacherApi(this.currentUser);
  const teacherId = getAddedTeacherId(this);
  this.deleteTeacherResponse = await teacher.delete(teacherId);
});

When("I delete the teacher with id: {int}", async function (id: number) {
  const teacher = new TeacherApi(this.currentUser);
  this.deleteTeacherResponse = await teacher.delete(id);
});

Then("I see the teacher is deleted successfully", async function () {
  assertDeleteSuccess<Spec>(this.deleteTeacherResponse.response);
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
      this.deleteTeacherResponse.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);
