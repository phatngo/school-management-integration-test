import { When, Then } from "@cucumber/cucumber";
import {
  getAddedTeacherId,
  getTeacherService,
} from "../../utils/cucumber.utils";
import {
  assertDeleteSuccess,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/http.constants";

When("I delete the added teacher", async function () {
  const teacher = getTeacherService("publicUsers.user1");
  const teacherId = getAddedTeacherId(this);
  const response = await teacher.delete(teacherId).toss();

  return (this.deleteTeacherResponse = {
    response,
  });
});

When("I delete the teacher with id: {int}", async function (id: number) {
  const teacher = getTeacherService("publicUsers.user1");

  const response = await teacher.delete(id).toss();

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
