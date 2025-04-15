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

app.use("/api", mainRouter);
app.get("/test", (req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const statusCode: number = err.statusCode || 500;
  const errorCode: any = err.errorCode || "unknown_error";
  const message: any = err.message || "Internal server error";

  res.status(statusCode).send({
    success: false,
    message: message,
    errorCode: errorCode
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
