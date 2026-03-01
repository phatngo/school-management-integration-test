import { When, Then } from "@cucumber/cucumber";
import {
  getAddedTeacherId,
  getTeacherService,
  parseDataTable,
} from "../../utils/cucumber.utils";
import {
  assertPutSuccess,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/http.constants";

const TEACHER_RESPONSE_SCHEMA_PATH = "schemas/teachers.api.response.schema.json";

When(
  "I modify the added teacher with the following data:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const teacher = getTeacherService("publicUsers.user1");

    const teacherId = getAddedTeacherId(this);

    const payload = {
      name: String(data.name),
    };

    const response = await teacher.put(teacherId, payload).toss();

    return (this.modifiedTeacherResponse = {
      payload,
      response,
    });
  },
);

When(
  "I modify the teacher with id: {int} and the following data:",
  async function (teacherId: number, teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const teacher = getTeacherService("publicUsers.user1");

    const payload = {
      name: String(data.name),
    };

    const response = await teacher.put(teacherId, payload).toss();

    return (this.modifiedTeacherResponse = {
      payload,
      response,
    });
  },
);

Then("I see the teacher is modified successfully", async function () {
  return assertPutSuccess(
    this.modifiedTeacherResponse.payload,
    this.modifiedTeacherResponse.response,
    TEACHER_RESPONSE_SCHEMA_PATH,
  );
});

Then(
  "I fail to modify the teacher as the teacher with {int} is not found",
  async function (id: number) {
    return assertErrorResponse(
      this.modifiedTeacherResponse.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${id} is not found`,
    );
  },
);

Then("I fail to modify the teacher as name cannot be empty", async function () {
  return assertErrorResponse(
    this.modifiedTeacherResponse.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `name should not be empty!`,
  );
});
