export type UserData = {
  id: string;
  email: string;
  name?: string | null;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCreatePayload = {
  email: string;
  name?: string;
  password: string;
};
