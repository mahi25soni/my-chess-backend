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

  public async get(req: Request, res: Response, next: NextFunction) {
    const response: any = new ApiReponse(res);
    try {
      const gameId: any = req.body.gameId;
      const data: any = await GameService.get(gameId);
      response.sendSuccessResponse(data, "Games fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const response: any = new ApiReponse(res);
    try {
      const data: any = await GameService.update(req.body);
      response.sendSuccessResponse(data, "Game updated successfully");
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: Request, res: Response, next: NextFunction) {
    const response: any = new ApiReponse(res);
    try {
      const gameId: any = req.body.gameId;
      const data: any = await GameService.delete(gameId);
      response.sendSuccessResponse(data, "Game deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  public async getGameByUser(req: Request, res: Response, next: NextFunction) {
    const response: any = new ApiReponse(res);
    try {
      const userId: any = req.body.userId;
      const data: any = await GameService.getGameByUser(userId);
      response.sendSuccessResponse(data, "Games fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new GameController();
