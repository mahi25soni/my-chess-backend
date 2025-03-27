import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { app, httpServer, PORT } from "./libs/socketSetup";
import mainRouter from "./routes/mainRouter";

app.use(cors());
app.use(express.json());

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send({
    success: false,
    message: err.message || "Internal server error",
    data: null
  });
});

app.use("/api", mainRouter);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
