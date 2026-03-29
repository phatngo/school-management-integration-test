import { When, Then } from "@cucumber/cucumber";
import { LIST_TEACHERS_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { RequestInfo } from "../../types/api/common.api.types";

When(
  "I view page {int} with limit {int} of teachers",
  async function (page: number, limit: number) {
    const teacher = new TeacherApi(this.currentUser);
    const getListTeachers: RequestInfo = await teacher.list({ page, limit });
    this.getListTeachers = getListTeachers;
  },
);

Then("I see the list of teachers are fetched correctly", async function () {
  assertCommon(
    LIST_TEACHERS_RESPONSE_SCHEMA_PATH,
    this.getListTeachers.response,
    HTTP_STATUS.OK,
  );

  const responseBody = this.getListTeachers.response.body;
  const page = this.getListTeachers.params?.page;
  const limit = this.getListTeachers.params?.limit;

  // Check if the response code is OK and the number of teachers returned is less than or equal to the limit
  expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
  expect(responseBody.data.length).to.lessThanOrEqual(limit);

  const listTeachers = await this.teacherDb.getList(
    limit,
    page * limit - limit,
  );

//   Check if the teachers returned in the response match with the data in the database
  expect(responseBody.data).to.deep.equal(listTeachers);
});
