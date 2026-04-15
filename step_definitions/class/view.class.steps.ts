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

When("I view the existing class", async function () {
  const exisitingClassId = this.seededClass.id;
  const classApi = new ClassApi(this.currentUser);

  const getClass = await classApi.get(exisitingClassId);
  this.getClass = getClass;
});

When("I view the class with id: {string}", async function (classId: string) {
  const classApi = new ClassApi(this.currentUser);

  const getClass = await classApi.get(classId);
  this.getClass = getClass;
});

Then(
  "I see the class is fetched correctly with the following details:",
  async function (classInfo: { rawTable: string[][] }) {
    // this = CustomWorld instance, which has properties like currentUser, classDb, etc. that we can use in our step definitions.
    // Learn more in ./step_definitions/common/world.ts
    const expectedData = await parseDataTable(classInfo.rawTable, this);

    assertCommon(
      CLASS_RESPONSE_SCHEMA_PATH,
      this.getClass.response,
      HTTP_STATUS.OK,
    );

    const responseBody = this.getClass.response.body;

    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.id).to.equal(this.seededClass.id);
    expect(responseBody.data.name).to.equal(expectedData.name);
    expect(responseBody.data.class_type).to.equal(expectedData.class_type);
    expect(responseBody.data.teacher_id).to.equal(expectedData.teacher_id);

    const classDataInDb = await this.classDb.getById(responseBody.data.id);

    expect(classDataInDb.id).to.equal(this.seededClass.id);
    expect(classDataInDb.name).to.equal(expectedData.name);
    expect(classDataInDb.class_type).to.equal(expectedData.class_type);
    expect(classDataInDb.teacher_id).to.equal(expectedData.teacher_id);
  },
);

Then(
  "I fail to see the class as the class with id: {string} is not found",
  async function (classId: string) {
    assertErrorResponse(
      this.getClass.response,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `class with id: ${classId} is not found`,
    );
  },
);
