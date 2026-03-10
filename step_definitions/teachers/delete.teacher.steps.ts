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
import { TeacherService } from "../../api/teacher.service";

When("I delete the added teacher", async function () {
  const teacher = new TeacherService(this.currentUser);
  const teacherId = getAddedTeacherId(this);
  const response = await teacher.delete(teacherId);

  return (this.deleteTeacherResponse = {
    id: teacherId,
    response,
  });
});

When("I delete the teacher with id: {int}", async function (id: number) {
  const teacher = new TeacherService(this.currentUser);

  const response = await teacher.delete(id);

  return (this.deleteTeacherResponse = {
    id,
    response,
  });
});

Then("I see the teacher is deleted successfully", async function () {
  assertDeleteSuccess(this.deleteTeacherResponse.response);

  const removedTeacherData = await this.teacherDb.getById(
    this.deleteTeacherResponse.id,
  );

  if (removedTeacherData) {
    throw new Error(
      `Teacher with id ${this.deleteTeacherResponse.id} still exists in the database after deletion`,
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
