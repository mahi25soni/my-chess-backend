import { Router } from "express";
import AuthController from "../controllers/AuthController";
const AuthRouter: Router = Router();

AuthRouter.post("/login", AuthController.login);

export default AuthRouter;
