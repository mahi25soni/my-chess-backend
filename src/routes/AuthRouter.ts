import { Router } from "express";
import AuthController from "../controllers/AuthController";
const AuthRouter: Router = Router();

AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/testing", (req, res) => {
  console.log("thre output is ", req.body);
  res.send(req.body);
});

export default AuthRouter;
