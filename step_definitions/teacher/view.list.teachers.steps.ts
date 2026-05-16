import { When, Then } from "@cucumber/cucumber";
import { LIST_TEACHERS_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { ListOptions } from "../../types/api/common.api.types";
import { parseDataTable } from "../../utils/cucumber.utils";

When(
  "I view the list of teachers with the following options:",
  async function (listOptions: { rawTable: string[][] }) {
    const teacher = new TeacherApi(this.currentUser);
    const data = (await parseDataTable(listOptions.rawTable, this)) as ListOptions;
    this.getListTeachers = await teacher.list(data);
  },
);

When("I view the default list of teachers", async function () {
  const teacher = new TeacherApi(this.currentUser);
  this.getListTeachers = await teacher.list();
});

Then(
  "I see the page {int} of the list of teachers with limit of {int} are fetched correctly",
  async function (page: number, limit: number) {
    const { actualResponseCode, actualResponseBody } = this.getListTeachers;

    expect(actualResponseCode).to.equal(HTTP_STATUS.OK);
    assertResponseSchema(actualResponseBody, LIST_TEACHERS_RESPONSE_SCHEMA_PATH);

    const offset = (page - 1) * limit;

    // Check if the response code is OK and the number of teachers returned is less than or equal to the limit
    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(actualResponseBody.data.items).to.be.an("array");
    const listPaginatedTeachers = await this.teacherDb.getList(limit, offset);

    // Check if the teachers returned in the response match with the data in the database
    expect(actualResponseBody.data.items).to.deep.equal(listPaginatedTeachers);
    expect(actualResponseBody.data.from).to.equal(offset + 1);
    expect(actualResponseBody.data.to).to.equal(
      offset + listPaginatedTeachers.length,
    );

    if (page > 1) {
      expect(actualResponseBody.data.previous_page).to.equal(page - 1);
    } else {
      expect(actualResponseBody.data.previous_page).to.be.null;
    }

    const listAllTeachers = await this.teacherDb.getList();
    expect(actualResponseBody.data.total).to.equal(listAllTeachers.length);

    if (page * limit >= listAllTeachers.length) {
      expect(actualResponseBody.data.next_page).to.be.null;
    } else {
      expect(actualResponseBody.data.next_page).to.equal(page + 1);
    }
  },
);

Then(
  "I fail to view the list of teachers due to invalid limits",
  async function () {
    const { actualResponseCode, actualResponseBody } = this.getListTeachers;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      `Invalid limit! Limit must be a positive integer.`,
    );
  },
);

Then(
  "I fail to view the list of teachers due to invalid page number",
  async function () {
    const { actualResponseCode, actualResponseBody } = this.getListTeachers;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      `Invalid page number! Page must be a positive integer.`,
    );
  },
);
