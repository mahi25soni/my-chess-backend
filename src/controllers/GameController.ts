import { NextFunction, Request, Response } from "express";
import ApiReponse from "../utils/ApiResponse";
import GameService from "../services/GameService";

class GameController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const response: any = new ApiReponse(res);
    try {
      // const data = new
      const data: any = await GameService.create(req.body);
      response.sendSuccessResponse(data, "Game created successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new GameController();
