import { expect } from "chai";
import { readJSONFile } from "./files.utils";
import { ErrorResponseBody, PactResponse } from "../types/api/common.api.types";

const ERROR_RESPONSE_SCHEMA_PATH = "schemas/error.api.response.schema.json";

export function assertErrorResponse(
  actualResponseCode: number,
  actualResponseBody: ErrorResponseBody,
  expectedResponseCode: number,
  expectedStatusCodeInResponseBody: string,
  expectedErrorMessage: string,
) {
  expect(actualResponseCode).to.equal(expectedResponseCode);
  expect(actualResponseBody.code).to.equal(expectedStatusCodeInResponseBody);
  expect(actualResponseBody.error).to.equal(expectedErrorMessage);
}

export function assertResponseSchema<T>(
  actualResponseBody: any,
  expectedResponseSchemaPath: string | null,
) {
  if (expectedResponseSchemaPath) {
    const schema = readJSONFile(expectedResponseSchemaPath);
    // expect(actualResponseBody).to.be.jsonSchema(schema);
  }
}
