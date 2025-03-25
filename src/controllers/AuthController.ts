import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: any = await AuthService.login(req.body);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
