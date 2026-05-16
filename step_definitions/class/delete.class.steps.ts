import { Then, When } from "@cucumber/cucumber";
import { ClassApi } from "../../api/class.api";
import {
  HTTP_STATUS,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import { assertErrorResponse } from "../../utils/api.response.assertion.utils";
import { expect } from "chai";

When("I delete the existing class", async function () {
  const exisitingClassId = this.seededClass.id;
  const classApi = new ClassApi(this.currentUser);
  this.deletedClass = await classApi.delete(exisitingClassId);
});

When("I delete the class with id: {string}", async function (classId: string) {
  const classApi = new ClassApi(this.currentUser);
  this.deletedClass = await classApi.delete(classId);
});

Then("I see the class is deleted successfully", async function () {
  const { actualResponseCode } = this.deletedClass;
  expect(actualResponseCode).to.equal(HTTP_STATUS.NO_CONTENT);

  const classDataInDb = await this.classDb.getById(this.seededClass.id);
  expect(classDataInDb).to.be.null;
});

Then(
  "I fail to delete the class with id: {string} is not found",
  async function (classId: string) {
    const { actualResponseCode, actualResponseBody } = this.deletedClass;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.NOT_FOUND,
      RESPONSE_CODE.NOT_FOUND,
      `class with id: ${classId} is not found`,
    );
  },
);
