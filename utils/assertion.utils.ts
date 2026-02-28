import { expect } from "pactum";
import { readJSONFile } from "./files.utils";
import { like } from "pactum-matchers";

export function assertSuccessfulPostResponse<T, U>(
  requestBody: T,
  response: U,
  expectedResponseSchemaPath: string,
  expectedStatus: number,
  expectedCode: string,
  expectedData: any,
) {
  const schema = readJSONFile(expectedResponseSchemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
  expect(response).to.have.jsonMatch({
    code: expectedCode,
    data: {
      ...expectedData,
      id: like(100),
    },
  });
}

export function assertSuccessfulGetResponse<T, U>(
  response: U,
  expectedResponseSchemaPath: string,
  expectedStatus: number,
  expectedCode: string,
  expectedData: any,
) {
  const schema = readJSONFile(expectedResponseSchemaPath);
  expect(response).to.have.status(expectedStatus);
  expect(response).to.have.jsonSchema(schema);
  expect(response).to.have.jsonMatch({
    code: expectedCode,
    data: {
      ...expectedData,
      id: like(100),
    },
  });
}
