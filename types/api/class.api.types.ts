export type ClassRequestBody = {
  name: string;
  teacher_id: number;
  class_type: string;
};

export type ClassResponseData = ClassRequestBody & {
  id: string;
};
