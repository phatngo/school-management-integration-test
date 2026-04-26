import { When, Then } from "@cucumber/cucumber";
import { StudentApi } from "../../api/student.api";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import {
  HTTP_STATUS,
  LIST_STUDENTS_RESPONSE_SCHEMA_PATH,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import { expect } from "chai";
import { ListOptions, RequestInfo } from "../../types/api/common.api.types";
import { parseDataTable } from "../../utils/cucumber.utils";

When("I view the default list of students", async function () {
  const studentApi = new StudentApi(this.currentUser);
  const getListStudents: RequestInfo = await studentApi.list();
  this.getListStudents = getListStudents;
});

When(
  "I view the list of students with the following options:",
  async function (listOptions: { rawTable: [][] }) {
    const studentApi = new StudentApi(this.currentUser);
    const data = (await parseDataTable(listOptions.rawTable)) as ListOptions;
    const getListStudents: RequestInfo = await studentApi.list(data);
    this.getListStudents = getListStudents;
  },
);

Then(
  "I see the page {int} of the list of students with limit of {int} are fetched correctly",
  async function (page: number, limit: number) {
    const response = this.getListStudents.response;
    const responseBody = response.body;
    assertCommon(LIST_STUDENTS_RESPONSE_SCHEMA_PATH, response, HTTP_STATUS.OK);

    const offset = (page - 1) * limit;

    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.items).to.be.an("array");
    expect(responseBody.data.from).to.equal(offset + 1);

    const paginatedStudentsFromDb = await this.studentDb.getList(limit, offset);

    expect(responseBody.data.items).to.deep.equal(paginatedStudentsFromDb);
    expect(responseBody.data.to).to.equal(offset + paginatedStudentsFromDb.length);

    if (page > 1) {
      expect(responseBody.data.previous_page).to.equal(page - 1);
    } else {
      expect(responseBody.data.previous_page).to.be.null;
    }

    const allStudentsFromDb = await this.studentDb.getList();
    expect(responseBody.data.total).to.equal(allStudentsFromDb.length);

    if (page * limit >= allStudentsFromDb.length) {
      expect(responseBody.data.next_page).to.be.null;
    } else {
      expect(responseBody.data.next_page).to.equal(page + 1);
    }
  },
);

Then("I fail to view the list of students due to invalid limits", function () {
  return assertErrorResponse(
    this.getListStudents.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "Invalid limit! Limit must be a positive integer.",
  );
});

Then(
  "I fail to view the list of students due to invalid page number",
  function () {
    return assertErrorResponse(
      this.getListStudents.response,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      "Invalid page number! Page must be a positive integer.",
    );
  },
);
