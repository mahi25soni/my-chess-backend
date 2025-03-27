import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";
import { AuthLoginResponse } from "../types/authTypes";

class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        token
      }: {
        token: string;
      } = req.body;
      const data: AuthLoginResponse = await AuthService.login(token);
      res.cookie("token", data.token);
      res.status(200).json({
        data: data,
        message: "User logged in!",
        success: true
      });
    } catch (error) {
      console.log("error in AuthController - login: ", error);
      next(error);
    }
  }
}

export default new AuthController();
