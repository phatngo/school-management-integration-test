export type UserRequestBody = {
  username: string;
  api_key: string;
};

export type UserResponseData = UserRequestBody & {
  id: number;
  created_at: string;
};
