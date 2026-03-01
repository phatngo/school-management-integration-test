import { expect } from "pactum";
import { readJSONFile } from "./files.utils";
import { like } from "pactum-matchers";

const ERROR_RESPONSE_SCHEMA_PATH = "schemas/error.api.response.schema.json";

/**
 * Assert POST request was successful
 * Validates status, schema, code, and compares payload with response data
 */
export function assertPostSuccess<T, U>(
  requestPayload: T,
  response: U,
  schemaPath: string,
  expectedStatus: number = 201,
  expectedCode: string = "CREATED",
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
export function assertGetSuccess<T, U>(
  storedPayload: T,
  response: U,
  schemaPath: string,
  expectedStatus: number = 200,
  expectedCode: string = "OK",
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
export function assertPutSuccess<T, U>(
  requestPayload: T,
  response: U,
  schemaPath: string,
  expectedStatus: number = 200,
  expectedCode: string = "OK",
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
export function assertDeleteSuccess<U>(
  response: U,
  expectedStatus: number = 204,
) {
  return expect(response).to.have.status(expectedStatus);
}

/**
 * Assert GET LIST request was successful
 * Validates status, schema, code, and that data is an array
 */
export function assertListSuccess(
  response: any,
  schemaPath: string,
  expectedStatus: number = 200,
  expectedCode: string = "OK",
) {
  const schema = readJSONFile(schemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
  return expect(response).to.have.jsonMatch({
    code: expectedCode,
  });
}

export function assertErrorResponse<U>(
  response: U,
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

export function assertCommon<T>(
  responseSchemaPath: string,
  response: T,
  expectedStatus: number,
) {
  const schema = readJSONFile(responseSchemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
}
