export type Response<T> =
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
