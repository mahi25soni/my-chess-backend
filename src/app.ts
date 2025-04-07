import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { app, httpServer, PORT } from "./libs/socketSetup";
import mainRouter from "./routes/mainRouter";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: "*",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send({
    success: false,
    message: err.message || "Internal server error",
    data: null
  });
});

app.use("/api", mainRouter);
app.get("/test", (req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
