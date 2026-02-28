import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { TeacherService } from "../api/teacher.service";
import config from "config";
import { expect } from "pactum";
import { like } from "pactum-matchers";
import { TeacherRequestBody } from "../types/api/teacher.api.types";
import { readJSONFile } from "../utils/files.utils";

const teacherResponseSchemaPathDir = "schemas/teacher.schema.json";

When(
  "I add a new teacher with the following profile:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = Object.fromEntries(teacherProfile.rawTable);
    const payload: TeacherRequestBody = {
      name: data.name,
    };
    const teacher = new TeacherService(config.get("publicUsers.user1"));
    const response = await teacher.post(payload).toss();

    return (this.addedTeacher = {
      payload,
      response,
    });
  },
);

When("I view the added teacher", async function () {
  const teacher = new TeacherService(config.get("publicUsers.user1"));

  const teacherId = this.addedTeacher
    ? this.addedTeacher.response.body.data.id
    : "";

  const response = await teacher.get(teacherId).toss();

  return (this.getTeacherResponse = {
    response,
  });
});

When(
  "I modify the added teacher with the following data:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = Object.fromEntries(teacherProfile.rawTable);
    const teacher = new TeacherService(config.get("publicUsers.user1"));

    const teacherId = this.addedTeacher
      ? this.addedTeacher.response.body.data.id
      : "";

    const payload = {
      name: data.name,
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
    const data = Object.fromEntries(teacherProfile.rawTable);
    const teacher = new TeacherService(config.get("publicUsers.user1"));

    const payload = {
      name: data.name,
    };

    const response = await teacher.put(teacherId, payload).toss();

    return (this.modifiedTeacherResponse = {
      payload,
      response,
    });
  },
);

When("I view the teacher with id: {int}", async function (teacherId: number) {
  const teacher = new TeacherService(config.get("publicUsers.user1"));
  const response = await teacher.get(teacherId).toss();

  return (this.getTeacherResponse = {
    response,
  });
});

Then("I see the teacher is created successfully", async function () {
  const teacherResponeSchema = readJSONFile(teacherResponseSchemaPathDir);
  // assert response code
  expect(this.addedTeacher.response).to.have.status(201);

  // assert response body schema
  expect(this.addedTeacher.response).to.have.jsonSchema(teacherResponeSchema);

  // assert response body
  expect(this.addedTeacher.response).to.have.jsonMatch({
    code: "CREATED",
    data: {
      id: like(100),
      name: this.addedTeacher.payload.name,
    },
  });
});

Then(
  "I see the fetched teacher data matches the data when created",
  async function () {
    const teacherResponeSchema = readJSONFile(teacherResponseSchemaPathDir);
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
  const teacherResponeSchema = readJSONFile(teacherResponseSchemaPathDir);
  // assert response code
  expect(this.modifiedTeacherResponse.response).to.have.status(200);

  // assert response body schema
  expect(this.modifiedTeacherResponse.response).to.have.jsonSchema(
    teacherResponeSchema,
  );

  // assert response body
  expect(this.modifiedTeacherResponse.response).to.have.jsonMatch({
    code: "OK",
    data: {
      id: this.addedTeacher.response.body.data.id,
      name: this.modifiedTeacherResponse.payload.name,
    },
  });
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
