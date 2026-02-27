export type ClassRoomRequestBody = {
  name: string;
  teacher_id: number;
  class_type: "primary" | "secondary" | "high";
};

export type ClassRoomResponseData = ClassRoomRequestBody & {
  id: string;
};
