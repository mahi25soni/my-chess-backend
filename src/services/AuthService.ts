import { prisma } from "../libs/dbConnection";
import { AuthLoginBody } from "../types/authTypes";

class AuthService {
  public async login(data: AuthLoginBody) {
    try {
      // Add your logic here
      const nData: any = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.googleId
        }
      });

      return nData;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
