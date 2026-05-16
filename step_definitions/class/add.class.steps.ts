import { Then, When } from "@cucumber/cucumber";
import { parseDataTable } from "../../utils/cucumber.utils";
import { ClassApi } from "../../api/class.api";
import {
  CLASS_RESPONSE_SCHEMA_PATH,
  HTTP_STATUS,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import { expect } from "chai";
import { NUMBER } from "../../constants/types.constants";

When(
  "I add a new class with the following information:",
  async function (classInfo: { rawTable: string[][] }) {
    // `this` is the CustomWorld instance, which has properties like currentUser, classDb, etc. that we can use in our step definitions.
    const parsedClassInfo = await parseDataTable(classInfo.rawTable, this);
    const payload = {
      name: parsedClassInfo.name,
      class_type: parsedClassInfo.class_type,
      teacher_id: parsedClassInfo.teacher_id,
    };
    const classApi = new ClassApi(this.currentUser);
    this.addedClass = await classApi.post(payload);
  },
);

Then(
  "I see the new class is added successfully with the following information:",
  async function (classInfo: { rawTable: string[][] }) {
    const expectedData = await parseDataTable(classInfo.rawTable, this);
    const { actualResponseCode, actualResponseBody } = this.addedClass;

    expect(actualResponseCode).to.equal(HTTP_STATUS.CREATED);
    assertResponseSchema(actualResponseBody, CLASS_RESPONSE_SCHEMA_PATH);

    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.CREATED);
    expect(actualResponseBody.data.id).to.be.a(NUMBER);
    expect(actualResponseBody.data.name).to.equal(expectedData.name);
    expect(actualResponseBody.data.class_type).to.equal(expectedData.class_type);
    expect(actualResponseBody.data.teacher_id).to.equal(expectedData.teacher_id);

    const classDataInDb = await this.classDb.getById(actualResponseBody.data.id);
    expect(classDataInDb.id).to.equal(actualResponseBody.data.id);
    expect(classDataInDb.name).to.equal(expectedData.name);
    expect(classDataInDb.teacher_id).to.equal(expectedData.teacher_id);
    expect(classDataInDb.class_type).to.equal(expectedData.class_type);
  },
);

Then("I fail to add the class as name is invalid", async function () {
  const { actualResponseCode, actualResponseBody } = this.addedClass;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid name!`,
  );
});

Then("I fail to add the class as class name is duplicate", async function () {
  const { actualResponseCode, actualResponseBody } = this.addedClass;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.CONFLICT,
    RESPONSE_CODE.CONFLICT,
    `Duplicate class`,
  );
});

Then("I fail to add the class as teacher id is invalid", async function () {
  const { actualResponseCode, actualResponseBody } = this.addedClass;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid teacher_id!`,
  );
});

Then(
  "I fail to add the class as teacher with id: {int} is non existing",
  async function (teacherId: number) {
    const { actualResponseCode, actualResponseBody } = this.addedClass;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${teacherId} is not found`,
    );
  },
);

Then("I fail to add the class as class type is invalid", async function () {
  const { actualResponseCode, actualResponseBody } = this.addedClass;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid class_type!`,
  );
});

Then(
  "I fail to add the class as class type is not the allowed values",
  async function () {
    const { actualResponseCode, actualResponseBody } = this.addedClass;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      `class should be in [primary, elementary, high]`,
    );
  },
);
