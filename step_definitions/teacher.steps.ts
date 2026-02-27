import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { TeacherService } from "../api/teacher.service";
import config from "config";
import { expect } from "pactum";
import { like } from "pactum-matchers";

const createTeacherResponseSchemaPathDir =
  "schemas/teachers/create.schema.json";

When(
  "I add a new teacher with the following profile:",
  async function (teacherProfile: { rawTable: [][] }) {
    const data = Object.fromEntries(teacherProfile.rawTable);
    const payload = {
      name: data.name,
    };
    const teacher = new TeacherService(config.get("publicUsers.user1"));
    const spec = teacher.post(payload);
    this.addedTeacherResponse = await spec.toss();
  },
);

Then("I see the teacher is created successfully", async function () {
  // assert response code
  expect(this.addedTeacherResponse).to.have.status(201);

  // assert response body schema
  expect(this.addedTeacherResponse).to.have.jsonSchema({
    type: "object",
    properties: {
      code: {
        type: "string",
      },
      data: {
        type: "object",
        properties: {
          id: {
            type: "number",
          },
          name: {
            type: "string",
          },
        },
        required: ["id", "name"],
      },
    },
    required: ["code", "data"],
  });

  // assert response body
  expect(this.addedTeacherResponse).to.have.jsonMatch({
    code: "CREATED",
    data: {
      id: like(100),
      name: "David",
    },
  });
});
