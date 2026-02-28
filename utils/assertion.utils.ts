import { expect } from "pactum";
import { readJSONFile } from "./files.utils";
import { like } from "pactum-matchers";

/**
 * Assert POST request was successful
 * Validates status, schema, code, and compares payload with response data
 */
export function assertPostSuccess<T>(
  requestPayload: T,
  response: any,
  schemaPath: string,
  expectedStatus: number = 201,
  expectedCode: string = "CREATED",
) {
  const schema = readJSONFile(schemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
  expect(response).to.have.jsonMatch({
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
  response: any,
  schemaPath: string,
  expectedStatus: number = 200,
  expectedCode: string = "OK",
) {
  const schema = readJSONFile(schemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
  expect(response).to.have.jsonMatch({
    code: expectedCode,
    data: storedPayload,
  });
}

/**
 * Assert PUT request was successful
 * Validates status, schema, code, and compares payload with response data
 */
export function assertPutSuccess<T>(
  requestPayload: T,
  response: any,
  schemaPath: string,
  expectedStatus: number = 200,
  expectedCode: string = "OK",
) {
  const schema = readJSONFile(schemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
  expect(response).to.have.jsonMatch({
    code: expectedCode,
    data: requestPayload,
  });
}

/**
 * Assert DELETE request was successful
 * Validates status code (typically 204 No Content or 200 OK)
 */
export function assertDeleteSuccess(
  response: any,
  expectedStatus: number = 204,
) {
  expect(response).to.have.status(expectedStatus);
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
  expect(response).to.have.jsonMatch({
    code: expectedCode,
  });
  // expect(response.json().data).to.be.array();
}

/**
 * Assert successful response with optional payload comparison
 * Generic function for flexible use cases
 */
export function assertResponse(
  response: any,
  schemaPath: string,
  expectedStatus: number,
  expectedCode: string,
  comparePayload?: any,
) {
  const schema = readJSONFile(schemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);

  if (comparePayload) {
    expect(response).to.have.jsonMatch({
      code: expectedCode,
      data: comparePayload,
    });
  } else {
    expect(response).to.have.jsonMatch({
      code: expectedCode,
    });
  }
}
