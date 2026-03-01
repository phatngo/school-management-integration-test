import { When, Then } from "@cucumber/cucumber";
import { TeacherRequestBody } from "../../types/api/teacher.api.types";
import {
  getTeacherService,
  parseDataTable,
} from "../../utils/cucumber.utils";
import {
  assertPostSuccess,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/http.constants";

const TEACHER_RESPONSE_SCHEMA_PATH = "schemas/teachers.api.response.schema.json";

When(
  "I add a new teacher with the following profile:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const payload: TeacherRequestBody = {
      name: String(data.name),
    };
    const teacher = getTeacherService("publicUsers.user1");
    const response = await teacher.post(payload);

    return (this.addedTeacher = {
      payload,
      response,
    });
  },
);

Then("I see the teacher is created successfully", async function () {
  return assertPostSuccess(
    this.addedTeacher.payload,
    this.addedTeacher.response,
    TEACHER_RESPONSE_SCHEMA_PATH,
  );
});

Then("I fail to add the teacher as name cannot be empty", async function () {
  return assertErrorResponse(
    this.addedTeacher.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `name should not be empty!`,
  );
});
