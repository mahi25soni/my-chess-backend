import { NextFunction, Request, Response } from "express";
import ApiReponse from "../utils/ApiResponse";
import GametypeService from "../services/GametypeService";

class GametypeController {
  async get(req: Request, res: Response, next: NextFunction) {
    const response: any = new ApiReponse(res);
    try {
      const data: any = await GametypeService.get();
      response.sendSuccessResponse(data, "Fetched all game types");
    } catch (error) {
      next(error);
    }
  }
}

export default new GametypeController();
