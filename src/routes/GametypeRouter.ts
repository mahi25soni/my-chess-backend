import { Router } from "express";
import GametypeController from "../controllers/GametypeController";
const GametypeRouter: Router = Router();

GametypeRouter.get("/get", GametypeController.get);

export default GametypeRouter;
