import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { TeacherService } from "../api/teacher.service";
import config from "config";
import { expect } from "pactum";
import { like } from "pactum-matchers";
import { TeacherRequestBody } from "../types/api/teacher.api.types";
import { readJSONFile } from "../utils/files.utils";
import { getAddedTeacherId, getTeacherService, parseDataTable } from "../utils/cucumber.utils";
import {
  assertPostSuccess,
  assertGetSuccess,
  assertPutSuccess,
  assertListSuccess,
} from "../utils/assertion.utils";

const TEACHER_RESPONSE_SCHEMA = "schemas/teacher.schema.json";

When(
  "I add a new teacher with the following profile:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = parseDataTable(teacherProfile.rawTable);
    const payload: TeacherRequestBody = {
      name: String(data.name),
    };
    const teacher = getTeacherService(config.get("publicUsers.user1"));
    const response = await teacher.post(payload).toss();

    return (this.addedTeacher = {
      payload,
      response,
    });
  },
);

When("I view the added teacher", async function () {
  const teacher = getTeacherService(config.get("publicUsers.user1"));

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
    const teacher = getTeacherService(config.get("publicUsers.user1"));

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
    const teacher = getTeacherService(config.get("publicUsers.user1"));

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
  const teacher = getTeacherService(config.get("publicUsers.user1"));
  const response = await teacher.get(teacherId).toss();

  return (this.getTeacherResponse = {
    response,
  });
});

Then("I see the teacher is created successfully", async function () {
  assertPostSuccess(
    this.addedTeacher.payload,
    this.addedTeacher.response,
    teacherResponseSchemaPathDir,
    201,
    "CREATED",
  );
});

Then(
  "I see the fetched teacher data matches the data when created",
  async function () {
    const teacherResponeSchema = readJSONFile(TEACHER_RESPONSE_SCHEMA);
    // assert response code
    expect(this.getTeacherResponse.response).to.have.status(200);

    // assert response body schema
    expect(this.getTeacherResponse.response).to.have.jsonSchema(
      teacherResponeSchema,
    );

    // assert response body
    expect(this.getTeacherResponse.response).to.have.jsonMatch({
      code: "OK",
      data: {
        ...this.addedTeacher.response.body.data,
      },
    });
  },
);

Then("I see the teacher is modified successfully", async function () {
  assertPutSuccess(
    this.modifiedTeacherResponse.payload,
    this.modifiedTeacherResponse.response,
    teacherResponseSchemaPathDir,
    200,
    "OK",
  );
});

Then(
  "I fail to view the teacher as the teacher with {int} is not found",
  async function (id: number) {
    // assert response code
    expect(this.getTeacherResponse.response).to.have.status(404);

    // assert response body
    expect(this.getTeacherResponse.response).to.have.jsonMatch({
      code: "NOT_FOUND",
      error: `teacher with id: ${id} is not found`,
    });
  },
);

Then(
  "I fail to modify the teacher as the teacher with {int} is not found",
  async function (id: number) {
    // assert response code
    expect(this.modifiedTeacherResponse.response).to.have.status(404);

    // assert response body
    expect(this.modifiedTeacherResponse.response).to.have.jsonMatch({
      code: "NOT_FOUND",
      error: `teacher with id: ${id} is not found`,
    });
  },
);
