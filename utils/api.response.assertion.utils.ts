import chai, { expect } from "chai";
import chaiJsonSchema from "chai-json-schema";
import { readJSONFile } from "./files.utils";
import { ERROR_RESPONSE_SCHEMA_PATH } from "../constants/api.constants";
chai.use(chaiJsonSchema);

export function assertErrorResponse(
  actualResponseCode: number,
  actualResponseBody: Record<string, unknown>,
  expectedResponseCode: number,
  expectedStatusCodeInResponseBody: string,
  expectedErrorMessage: string,
) {
  expect(actualResponseCode).to.equal(expectedResponseCode);
  assertResponseSchema(actualResponseBody, ERROR_RESPONSE_SCHEMA_PATH);
  expect(actualResponseBody.code).to.equal(expectedStatusCodeInResponseBody);
  expect(actualResponseBody.error).to.equal(expectedErrorMessage);
}

export function assertResponseSchema(
  actualResponseBody: Record<string, unknown>,
  expectedResponseSchemaPath: string,
) {
  if (expectedResponseSchemaPath) {
    const schema = readJSONFile(expectedResponseSchemaPath);
    expect(actualResponseBody).to.be.jsonSchema(schema);
  }
}
