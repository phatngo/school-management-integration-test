export type TeacherRequestBody = {
  name: string;
};

export type TeacherResponseData = TeacherRequestBody & {
  id: string;
};
