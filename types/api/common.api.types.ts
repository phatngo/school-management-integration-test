import { spec } from "pactum";

export type PactResponse = Awaited<ReturnType<ReturnType<typeof spec>["toss"]>>;

export type RequestInfo<T> = {
  body?: T;
  response: PactResponse;
};

export type ApiLog = {
  method: string;
  endpoint: string;
  responseCode: number;
  responseBody: any;
  payload?: any;
};
