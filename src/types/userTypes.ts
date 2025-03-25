type UserData = {
  id: string;
  email: string;
  name?: string | null;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
};

export { UserData };
