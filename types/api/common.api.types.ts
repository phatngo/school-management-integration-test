import Spec from "pactum/src/models/Spec";

export type ResponseBody<T> =
  | {
      code: string;
      error: string;
    }
  | {
      code: string;
      data: T;
    }
  | null;

export type PaginatedResponse<T> = {
  code: string;
  data: T[];
};

export type SpecResponse<T> = {
  body?: T;
  response: Spec;
}