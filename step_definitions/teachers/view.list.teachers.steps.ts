import { When, Then } from "@cucumber/cucumber";
import { LIST_TEACHERS_RESPONSE_SCHEMA_PATH } from "../../constants/api.constants";
import { assertCommon } from "../../utils/api.response.assertion.utils";
import { HTTP_STATUS, RESPONSE_CODE } from "../../constants/api.constants";
import { TeacherApi } from "../../api/teacher.api";
import { expect } from "chai";
import { ListOptions, RequestInfo } from "../../types/api/common.api.types";
import { parseDataTable } from "../../utils/cucumber.utils";

When(
  "I view the list of teachers with the following options:",
  async function (listOptions: { rawTable: [][] }) {
    const teacher = new TeacherApi(this.currentUser);
    const data = parseDataTable(listOptions.rawTable) as ListOptions;
    const getListTeachers: RequestInfo = await teacher.list(data);
    this.getListTeachers = getListTeachers;
  },
);

When(
  "I view the default list of teachers",
  async function () {
    const teacher = new TeacherApi(this.currentUser);
    const getListTeachers: RequestInfo = await teacher.list();
    this.getListTeachers = getListTeachers;
  },
);

Then(
  "I see the page {int} of the list of teachers with limit of {int} are fetched correctly",
  async function (page: number, limit: number) {
    assertCommon(
      LIST_TEACHERS_RESPONSE_SCHEMA_PATH,
      this.getListTeachers.response,
      HTTP_STATUS.OK,
    );
    const responseBody = this.getListTeachers.response.body;

    // Check if the response code is OK and the number of teachers returned is less than or equal to the limit
    expect(responseBody.code).to.equal(RESPONSE_CODE.OK);
    expect(responseBody.data.length).to.lessThanOrEqual(limit);

    const listTeachers = await this.teacherDb.getList(
      limit,
      page * limit - limit,
    );

    //   Check if the teachers returned in the response match with the data in the database
    expect(responseBody.data).to.deep.equal(listTeachers);
  },
);
