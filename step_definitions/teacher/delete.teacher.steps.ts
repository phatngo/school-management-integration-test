import { When, Then } from "@cucumber/cucumber";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";

// Note: A teacher must be created before running the deletion steps.
// This is typically done using a "Given" step in the feature file, for example:
// Given a teacher with the following profile has existed in the system:
//   | name | Phat |

When("I delete the existing teacher", async function () {
  const teacher = new TeacherApi(this.currentUser);
  const seededTeacherId = this.seededTeacher.id;
  this.deleteTeacher = await teacher.delete(seededTeacherId);
});

When("I delete the teacher with id: {string}", async function (id: string) {
  const teacher = new TeacherApi(this.currentUser);
  this.deleteTeacher = await teacher.delete(id);
});

Then("I see the teacher is deleted successfully", async function () {
  assertCommon(null, this.deleteTeacher.response, HTTP_STATUS.NO_CONTENT);

  // Check if the teacher is actually removed from the database
  const seededTeacherId = this.seededTeacher.id;

  const removedTeacherData = await this.teacherDb.getById(seededTeacherId);
  expect(removedTeacherData).to.be.null;
});

Then(
  "I fail to delete the teacher as the teacher with {string} is not found",
  async function (id: string) {
    return assertErrorResponse(
      this.deleteTeacher.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);
