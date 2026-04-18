import { When, Then } from "@cucumber/cucumber";
import { ClassApi } from "../../api/class.api";
import {
  assertCommon,
  assertErrorResponse,
} from "../../utils/api.response.assertion.utils";
import {
  HTTP_STATUS,
  LIST_CLASSES_RESPONSE_SCHEMA_PATH,
  RESPONSE_CODE,
} from "../../constants/api.constants";
import { expect } from "chai";
import { parseDataTable } from "../../utils/cucumber.utils";
import { ListOptions } from "../../types/api/common.api.types";

When("I view the default list of classes", async function () {
  const getListTeachers = await new ClassApi(this.currentUser).list();
  this.getListClasses = getListTeachers;
});

When(
  "I view the list of classes with the following pagination options",
  async function (paginationOptions: { rawTable: string[][] }) {
    const parsedPaginationOptions = (await parseDataTable(
      paginationOptions.rawTable,
      this,
    )) as ListOptions;
    const getListTeachers = await new ClassApi(this.currentUser).list(
      parsedPaginationOptions,
    );
    this.getListClasses = getListTeachers;
  },
);

Then(
  "I see the page {int} of the list of classes with limit of {int} are fetched correctly",
  async function (page: number, limit: number) {
    const response = this.getListClasses.response;
    const responseBody = response.body;
    assertCommon(LIST_CLASSES_RESPONSE_SCHEMA_PATH, response, HTTP_STATUS.OK);

    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.from).to.equal((page - 1) * limit + 1);
    expect(responseBody.data.to).to.equal(
      Math.min(page * limit, responseBody.data.total),
    );

    if (page === 1) {
      expect(responseBody.data.previous_page).to.be.null;
    } else {
      expect(responseBody.data.previous_page).to.equal(page - 1);
    }

    if (page * limit >= responseBody.data.total) {
      expect(responseBody.data.next_page).to.be.null;
    } else {
      expect(responseBody.data.next_page).to.equal(page + 1);
    }

    const offset = (page - 1) * limit;

    const paginatedListClassesFromDb = await this.classDb.getList(
      limit,
      offset,
    );
    expect(responseBody.data.items.length).to.equal(
      paginatedListClassesFromDb.length,
    );
    expect(responseBody.data.items).to.deep.equal(paginatedListClassesFromDb);

    const allListClassesFromDb = await this.classDb.getList();
    expect(responseBody.data.total).to.equal(allListClassesFromDb.length);
  },
);

Then(
  "I fail to view the list of classes due to invalid page number",
  function () {
    assertErrorResponse(
      this.getListClasses.response,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      "Invalid page number! Page must be a positive integer.",
    );
  },
);

Then("I fail to view the list of classes due to invalid limits", function () {
  assertErrorResponse(
    this.getListClasses.response,
    HTTP_STATUS.BAD_REQUEST,
    RESPONSE_CODE.BAD_REQUEST,
    "Invalid limit! Limit must be a positive integer.",
  );
});
