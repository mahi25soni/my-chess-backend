import { Router } from "express";
import GameController from "../controllers/GameController";
const GameRouter: Router = Router();

GameRouter.post("/create", GameController.create);
GameRouter.get("/get", GameController.get);
GameRouter.put("/update", GameController.update);
GameRouter.delete("/delete", GameController.delete);
GameRouter.get("/getGameByUser", GameController.getGameByUser);

export default GameRouter;
