import { When, Then } from "@cucumber/cucumber";
import { TEACHER_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  getAddedTeacherId,
  getTeacherService,
} from "../../utils/cucumber.utils";
import {
  assertGetSuccess,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";


When("I view the added teacher", async function () {
  const teacher = new TeacherApi(this.currentUser);
  const teacherId = getAddedTeacherId(this);
  this.getTeacherResponse = await teacher.get(teacherId)
});

When("I view the teacher with id: {int}", async function (teacherId: number) {
  const teacher = new TeacherApi(this.currentUser);
  this.getTeacherResponse = await teacher.get(teacherId)
});

Then(
  "I see the fetched teacher data matches the data when created",
  async function () {
    return assertGetSuccess(
      this.addedTeacher.payload,
      this.getTeacherResponse.response,
      TEACHER_RESPONSE_SCHEMA_PATH,
    );
  },
);

Then(
  "I fail to view the teacher as the teacher with {int} is not found",
  async function (id: number) {
    return assertErrorResponse(
      this.getTeacherResponse.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);
