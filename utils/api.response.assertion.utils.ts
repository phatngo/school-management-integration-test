import { expect } from "pactum";
import { readJSONFile } from "./files.utils";
import { like } from "pactum-matchers";
import { HTTP_STATUS, RESPONSE_CODE } from "../constants/api.constants";
import { PactResponse } from "../types/api/common.api.types";

const ERROR_RESPONSE_SCHEMA_PATH = "schemas/error.api.response.schema.json";

/**
 * Assert POST request was successful
 * Validates status, schema, code, and compares payload with response data
 */
export function assertPostSuccess<T>(
  requestPayload: T,
  response: PactResponse,
  schemaPath: string,
  expectedStatus: number = HTTP_STATUS.CREATED,
  expectedCode: string = RESPONSE_CODE.CREATED,
) {
  assertCommon(schemaPath, response, expectedStatus);
  return expect(response).to.have.jsonMatch({
    code: expectedCode,
    data: {
      ...requestPayload,
      id: like(100),
    },
  });
}

/**
 * Assert GET request was successful
 * Validates status, schema, code, and compares stored payload with response data
 */
export function assertGetSuccess<T>(
  storedPayload: T,
  response: PactResponse,
  schemaPath: string,
  expectedStatus: number = HTTP_STATUS.OK,
  expectedCode: string = RESPONSE_CODE.OK,
) {
  assertCommon(schemaPath, response, expectedStatus);
  return expect(response).to.have.jsonMatch({
    code: expectedCode,
    data: { ...storedPayload, id: like(100) },
  });
}

/**
 * Assert PUT request was successful
 * Validates status, schema, code, and compares payload with response data
 */
export function assertPutSuccess<T>(
  requestPayload: T,
  response: PactResponse,
  schemaPath: string,
  expectedStatus: number = HTTP_STATUS.OK,
  expectedCode: string = RESPONSE_CODE.OK,
) {
  assertCommon(schemaPath, response, expectedStatus);
  return expect(response).to.have.jsonMatch({
    code: expectedCode,
    data: { ...requestPayload, id: like(100) },
  });
}

/**
 * Assert DELETE request was successful
 * Validates status code (typically 204 No Content or 200 OK)
 */
export function assertDeleteSuccess(
  response: PactResponse,
  expectedStatus: number = HTTP_STATUS.NO_CONTENT,
) {
  return expect(response).to.have.status(expectedStatus);
}

/**
 * Assert GET LIST request was successful
 * Validates status, schema, code, and that data is an array
 */
export function assertListSuccess(
  response: PactResponse,
  schemaPath: string,
  expectedStatus: number = HTTP_STATUS.OK,
  expectedCode: string = RESPONSE_CODE.OK,
) {
  const schema = readJSONFile(schemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
  return expect(response).to.have.jsonMatch({
    code: expectedCode,
  });
}

export function assertErrorResponse(
  response: PactResponse,
  expectedStatus: number,
  expectedCode: string,
  expectedErrorMessage: string,
) {
  assertCommon(ERROR_RESPONSE_SCHEMA_PATH, response, expectedStatus);
  return expect(response).to.have.jsonMatch({
    code: expectedCode,
    error: expectedErrorMessage,
  });
}

export function assertCommon(
  responseSchemaPath: string,
  response: PactResponse,
  expectedStatus: number,
) {
  const schema = readJSONFile(responseSchemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
}
