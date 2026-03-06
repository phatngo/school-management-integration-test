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
    response,
  });
});

When("I delete the teacher with id: {int}", async function (id: number) {
  const teacher = new TeacherService(this.currentUser);

  const response = await teacher.delete(id);

  return (this.deleteTeacherResponse = {
    response,
  });
});

Then("I see the teacher is deleted successfully", async function () {
  return assertDeleteSuccess(this.deleteTeacherResponse.response);
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
