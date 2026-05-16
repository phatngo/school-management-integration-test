import { When, Then } from "@cucumber/cucumber";
import { StudentApi } from "../../api/student.api";
import {
  assertErrorResponse,
  assertResponseSchema,
} from "../../utils/api.response.assertion.utils";
import {
  HTTP_STATUS,
  LIST_STUDENTS_RESPONSE_SCHEMA_PATH,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import { expect } from "chai";
import { ListOptions } from "../../types/api/common.api.types";
import { parseDataTable } from "../../utils/cucumber.utils";

When("I view the default list of students", async function () {
  const studentApi = new StudentApi(this.currentUser);
  this.getListStudents = await studentApi.list();
});

When(
  "I view the list of students with the following options:",
  async function (listOptions: { rawTable: string[][] }) {
    const studentApi = new StudentApi(this.currentUser);
    const data = (await parseDataTable(listOptions.rawTable, this)) as ListOptions;
    this.getListStudents = await studentApi.list(data);
  },
);

Then(
  "I see the page {int} of the list of students with limit of {int} are fetched correctly",
  async function (page: number, limit: number) {
    const { actualResponseCode, actualResponseBody } = this.getListStudents;

    expect(actualResponseCode).to.equal(HTTP_STATUS.OK);
    assertResponseSchema(actualResponseBody, LIST_STUDENTS_RESPONSE_SCHEMA_PATH);

    const offset = (page - 1) * limit;

    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(actualResponseBody.data.items).to.be.an("array");
    expect(actualResponseBody.data.from).to.equal(offset + 1);

    const paginatedStudentsFromDb = await this.studentDb.getList(limit, offset);

    expect(actualResponseBody.data.items).to.deep.equal(paginatedStudentsFromDb);
    expect(actualResponseBody.data.to).to.equal(offset + paginatedStudentsFromDb.length);

    if (page > 1) {
      expect(actualResponseBody.data.previous_page).to.equal(page - 1);
    } else {
      expect(actualResponseBody.data.previous_page).to.be.null;
    }

    const allStudentsFromDb = await this.studentDb.getList();
    expect(actualResponseBody.data.total).to.equal(allStudentsFromDb.length);

    if (page * limit >= allStudentsFromDb.length) {
      expect(actualResponseBody.data.next_page).to.be.null;
    } else {
      expect(actualResponseBody.data.next_page).to.equal(page + 1);
    }
  },
);

Then("I fail to view the list of students due to invalid limits", function () {
  const { actualResponseCode, actualResponseBody } = this.getListStudents;
  return assertErrorResponse(
    actualResponseCode,
    actualResponseBody,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "Invalid limit! Limit must be a positive integer.",
  );
});

Then(
  "I fail to view the list of students due to invalid page number",
  function () {
    const { actualResponseCode, actualResponseBody } = this.getListStudents;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      "Invalid page number! Page must be a positive integer.",
    );
  },
);
