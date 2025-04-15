import { Router } from "express";
import AuthRouter from "./AuthRouter";
import GametypeRouter from "./GametypeRouter";

const mainRouter: Router = Router();

mainRouter.use("/user", AuthRouter);
mainRouter.use("/gametype", GametypeRouter);

export default mainRouter;
