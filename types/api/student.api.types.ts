export type StudentRequestBody = {
  name: string;
  phone_number: string;
  class_id: number;
};

export type StudentResponseData = StudentRequestBody & {
  id: string;
};
