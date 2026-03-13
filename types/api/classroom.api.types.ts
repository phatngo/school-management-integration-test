export type ClassRoomRequestBody = {
  name: string;
  teacher_id: number;
  class_type: string;
};

export type ClassRoomResponseData = ClassRoomRequestBody & {
  id: string;
};
