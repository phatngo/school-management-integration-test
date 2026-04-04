import { spec } from "pactum";

export type PactResponse = Awaited<ReturnType<ReturnType<typeof spec>["toss"]>>;

export type RequestInfo<T = any> = {
  body?: T;
  params?: {
    page?: string;
    limit?: string;
  };
  response: PactResponse;
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

export type PaginatedResponseBody<T> = {
  code: number;
  data: T[];
};

export type ListOptions = {
  page?: string;
  limit?: string;
};