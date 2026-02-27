export type TeacherRequestBody = {
  name: string;
};

export type TeacherResponseBody = TeacherRequestBody & {
  id: string;
};
