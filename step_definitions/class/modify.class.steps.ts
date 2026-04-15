import { Then, When } from "@cucumber/cucumber";
import { parseDataTable } from "../../utils/cucumber.utils";
import { ClassApi } from "../../api/class.api";
import {
  CLASS_RESPONSE_SCHEMA_PATH,
  HTTP_STATUS,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { expect } from "chai";

When(
  "I modify the existing class with the following information:",
  async function (classInfo: { rawTable: [][] }) {
    // `this` is the CustomWorld instance, which has properties like currentUser, classDb, etc. that we can use in our step definitions.
    const parsedClassInfo = await parseDataTable(classInfo.rawTable, this);
    const payload = {
      name: parsedClassInfo.name,
      class_type: parsedClassInfo.class_type,
      teacher_id: parsedClassInfo.teacher_id,
    };
    const classApi = new ClassApi(this.currentUser);
    const modifiedClass = await classApi.put(this.seededClass.id, payload);
    this.modifiedClass = modifiedClass;
  },
);

When(
  "I modify the class with id: {int} with the following information:",
  async function (classId: number, classInfo: { rawTable: [][] }) {
    // `this` is the CustomWorld instance, which has properties like currentUser, classDb, etc. that we can use in our step definitions.
    const parsedClassInfo = await parseDataTable(classInfo.rawTable, this);
    const payload = {
      name: parsedClassInfo.name,
      class_type: parsedClassInfo.class_type,
      teacher_id: parsedClassInfo.teacher_id,
    };
    const classApi = new ClassApi(this.currentUser);
    const modifiedClass = await classApi.put(classId.toString(), payload);
    this.modifiedClass = modifiedClass;
  },
);

Then(
  "I see the class is modified successfully with the following information:",
  async function (classInfo: { rawTable: [][] }) {
    const expectedData = await parseDataTable(classInfo.rawTable, this);
    assertCommon(
      CLASS_RESPONSE_SCHEMA_PATH,
      this.modifiedClass.response,
      HTTP_STATUS.OK,
    );

    const responseBody = this.modifiedClass.response.body;

    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.id).to.be.a("number");
    expect(responseBody.data.name).to.equal(expectedData.name);
    expect(responseBody.data.class_type).to.equal(expectedData.class_type);
    expect(responseBody.data.teacher_id).to.equal(expectedData.teacher_id);

    const classDataInDb = await this.classDb.getById(responseBody.data.id);
    expect(classDataInDb.id).to.equal(responseBody.data.id);
    expect(classDataInDb.name).to.equal(expectedData.name);
    expect(classDataInDb.teacher_id).to.equal(expectedData.teacher_id);
    expect(classDataInDb.class_type).to.equal(expectedData.class_type);
  },
);

Then("I fail to modify the class as class with id: {int} is not found", async function (classId: number) {
  return assertErrorResponse(
    this.modifiedClass.response,
    HTTP_STATUS.NOT_FOUND,
    RESPONSE_CODE.NOT_FOUND,
    `class with id: ${classId} is not found`,
  );
});

Then("I fail to modify the class as class name is duplicate", async function () {
  return assertErrorResponse(
    this.modifiedClass.response,
    HTTP_STATUS.CONFLICT,
    RESPONSE_CODE.CONFLICT,
    `Duplicate class`,
  );
});

Then("I fail to modify the class as name is invalid", async function () {
  return assertErrorResponse(
    this.modifiedClass.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid name!`,
  );
});

Then("I fail to modify the class as teacher id is invalid", async function () {
  return assertErrorResponse(
    this.modifiedClass.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid teacher_id!`,
  );
});

Then(
  "I fail to modify the class as teacher with id: {int} is non existing",
  async function (teacherId: number) {
    return assertErrorResponse(
      this.modifiedClass.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `teacher with id: ${teacherId} is not found`,
    );
  },
);

Then("I fail to modify the class as class type is invalid", async function () {
  return assertErrorResponse(
    this.modifiedClass.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    `invalid class_type!`,
  );
});

Then(
  "I fail to modify the class as class type is not the allowed values",
  async function () {
    return assertErrorResponse(
      this.modifiedClass.response,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      `class should be in [primary, elementary, high]`,
    );
  },
);
