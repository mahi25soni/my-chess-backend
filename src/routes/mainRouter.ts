import { Router } from "express";
import AuthRouter from "./AuthRouter";

const mainRouter: Router = Router();

mainRouter.use("/user", AuthRouter);

export default mainRouter;
