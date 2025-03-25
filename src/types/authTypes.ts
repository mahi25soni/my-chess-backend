import { UserData } from "./userTypes";

type AuthLoginBody = {
  email: string;
  name: string;
  googleId: string;
};

type AuthLoginResponse = {
  token: string;
  user: UserData;
};

export { AuthLoginBody, AuthLoginResponse };
