import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { TeacherRequestBody } from "../types/api/teacher.api.types";
import {
  getAddedTeacherId,
  getTeacherService,
  parseDataTable,
} from "../utils/cucumber.utils";
import {
  assertPostSuccess,
  assertGetSuccess,
  assertPutSuccess,
  assertErrorResponse,
} from "../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../constants/http.constants";

const TEACHER_RESPONSE_SCHEMA_PATH = "schemas/teacher.api.response.schema.json";

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

When("I view the added teacher", async function () {
  const teacher = getTeacherService("publicUsers.user1");

  const teacherId = getAddedTeacherId(this);

  const response = await teacher.get(teacherId).toss();

  return (this.getTeacherResponse = {
    response,
  });
});

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

When("I view the teacher with id: {int}", async function (teacherId: number) {
  const teacher = getTeacherService("publicUsers.user1");
  const response = await teacher.get(teacherId).toss();

  return (this.getTeacherResponse = {
    response,
  });
});

Then("I see the teacher is created successfully", async function () {
  return assertPostSuccess(
    this.addedTeacher.payload,
    this.addedTeacher.response,
    TEACHER_RESPONSE_SCHEMA_PATH,
  );
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

Then("I see the teacher is modified successfully", async function () {
  return assertPutSuccess(
    this.modifiedTeacherResponse.payload,
    this.modifiedTeacherResponse.response,
    TEACHER_RESPONSE_SCHEMA_PATH,
  );
});

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

Then(
  "I fail to modify the teacher as name cannot be empty",
  async function () {
    return assertErrorResponse(
      this.modifiedTeacherResponse.response,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      `name should not be empty!`,
    );
  },
);

Then(
  "I fail to add the teacher as name cannot be empty",
  async function () {
    return assertErrorResponse(
      this.addedTeacher.response,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      `name should not be empty!`,
    );
  },
);
