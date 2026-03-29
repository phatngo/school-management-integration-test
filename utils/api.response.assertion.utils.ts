import { expect } from "chai";
import { readJSONFile } from "./files.utils";
import { PactResponse } from "../types/api/common.api.types";

const ERROR_RESPONSE_SCHEMA_PATH = "schemas/error.api.response.schema.json";

export function assertErrorResponse(
  response: PactResponse,
  expectedStatus: number,
  expectedCode: string,
  expectedErrorMessage: string,
) {
  assertCommon(ERROR_RESPONSE_SCHEMA_PATH, response, expectedStatus);
  expect(response.body.code).to.equal(expectedCode);
  expect(response.body.error).to.equal(expectedErrorMessage);
}

export function assertCommon(
  responseSchemaPath: string | null,
  response: PactResponse,
  expectedStatus: number,
) {
  expect(response.statusCode).to.equal(expectedStatus);

  if (responseSchemaPath) {
    const schema = readJSONFile(responseSchemaPath);
  // expect(response).to.have.jsonSchema(schema);
  // expect(response.body).to.be.jsonSchema(schema);
  }
}
