import { Router } from "express";
import AuthRouter from "./AuthRouter";
import GametypeRouter from "./GametypeRouter";
import GameRouter from "./GameRouter";

const mainRouter: Router = Router();

mainRouter.use("/user", AuthRouter);
mainRouter.use("/gametype", GametypeRouter);
mainRouter.use("/game", GameRouter);

export default mainRouter;
