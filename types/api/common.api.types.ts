import { spec } from "pactum";

export type PactResponse = Awaited<ReturnType<ReturnType<typeof spec>["toss"]>>;

export type ParsedApiData<T = any> = {
  body?: T;
  actualResponseCode: number;
  actualResponseBody: T;
  actualResponseHeaders: Record<string, string>;
};

export type ApiLog = {
  method: string;
  endpoint: string;
  responseCode: number;
  responseBody: any;
  payload?: any;
};

export type ResponseBody<T> = {
  code: number;
  data: T;
};

export type ErrorResponseBody = {
  code: number;
  error: string;
};

export type PaginatedResponseBody<T> = {
  code: number;
  data: T[];
};

export type ListOptions = {
  page?: string;
  limit?: string;
};
