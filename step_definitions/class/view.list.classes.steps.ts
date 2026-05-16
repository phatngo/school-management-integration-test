import { When, Then } from "@cucumber/cucumber";
import { ClassApi } from "../../api/class.api";
import {
  assertErrorResponse,
  assertResponseSchema,
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
  this.getListClasses = await new ClassApi(this.currentUser).list();
});

When(
  "I view the list of classes with the following pagination options",
  async function (paginationOptions: { rawTable: string[][] }) {
    const parsedPaginationOptions = (await parseDataTable(
      paginationOptions.rawTable,
      this,
    )) as ListOptions;
    this.getListClasses = await new ClassApi(this.currentUser).list(
      parsedPaginationOptions,
    );
  },
);

Then(
  "I see the page {int} of the list of classes with limit of {int} are fetched correctly",
  async function (page: number, limit: number) {
    const { actualResponseCode, actualResponseBody } = this.getListClasses;

    expect(actualResponseCode).to.equal(HTTP_STATUS.OK);
    assertResponseSchema(actualResponseBody, LIST_CLASSES_RESPONSE_SCHEMA_PATH);

    expect(actualResponseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(actualResponseBody.data.from).to.equal((page - 1) * limit + 1);
    expect(actualResponseBody.data.to).to.equal(
      Math.min(page * limit, actualResponseBody.data.total),
    );

    if (page === 1) {
      expect(actualResponseBody.data.previous_page).to.be.null;
    } else {
      expect(actualResponseBody.data.previous_page).to.equal(page - 1);
    }

    if (page * limit >= actualResponseBody.data.total) {
      expect(actualResponseBody.data.next_page).to.be.null;
    } else {
      expect(actualResponseBody.data.next_page).to.equal(page + 1);
    }

    const offset = (page - 1) * limit;

    const paginatedListClassesFromDb = await this.classDb.getList(
      limit,
      offset,
    );
    expect(actualResponseBody.data.items.length).to.equal(
      paginatedListClassesFromDb.length,
    );
    expect(actualResponseBody.data.items).to.deep.equal(paginatedListClassesFromDb);

    const allListClassesFromDb = await this.classDb.getList();
    expect(actualResponseBody.data.total).to.equal(allListClassesFromDb.length);
  },
);

Then(
  "I fail to view the list of classes due to invalid page number",
  async function () {
    const { actualResponseCode, actualResponseBody } = this.getListClasses;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      "Invalid page number! Page must be a positive integer.",
    );
  },
);

Then(
  "I fail to view the list of classes due to invalid limits",
  async function () {
    const { actualResponseCode, actualResponseBody } = this.getListClasses;
    return assertErrorResponse(
      actualResponseCode,
      actualResponseBody,
      HTTP_STATUS.BAD_REQUEST,
      RESPONSE_CODE.BAD_REQUEST,
      "Invalid limit! Limit must be a positive integer.",
    );
  },
);
