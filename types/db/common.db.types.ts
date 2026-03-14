export type DbQueryLog = {
  query: string;
  params: any[] | null;
  result: any;
};
