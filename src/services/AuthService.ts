import { prisma } from "../libs/dbConnection";
import { UserData } from "../types/userTypes";
import { LoginTicket, OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const googleClient: OAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

class AuthService {
  public async login(token: string) {
    try {
      const ticket: LoginTicket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload: any = ticket.getPayload();

      if (!payload) {
        throw new Error("Invalid token payload");
      }

      const { name, email, sub } = payload; // Now safe

      if (!name || !email || !sub) {
        throw new Error("Not sufficent data from google login");
      }

      // Check if the user already exists
      const googleLoggedInUser: UserData | null = await prisma.user.findUnique({
        where: {
          email: email,
          googleId: sub
        }
      });
      if (googleLoggedInUser) {
        delete googleLoggedInUser?.password;
      }

      if (googleLoggedInUser) {
        const jwt_token: any = jwt.sign(googleLoggedInUser, "your_jwt_secret", {
          expiresIn: "24h"
        });
        return {
          user: googleLoggedInUser,
          token: jwt_token
        };
      }

      const user: UserData | null = await prisma.user.findUnique({
        where: {
          email: email
        }
      });

      if (user) {
        throw new Error("User already exist");
      }
      // Generate a random strong password
      const randomPassword: string = crypto.randomBytes(8).toString("hex"); // 16-char hex password
      const encryptedPassword: string = await bcrypt.hash(randomPassword, 10);

      const nData: UserData = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: encryptedPassword,
          googleId: sub
        }
      });

      const jwt_token: any = jwt.sign(nData, "your_jwt_secret", {
        expiresIn: "24h"
      });

      return {
        user: nData,
        token: jwt_token
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
