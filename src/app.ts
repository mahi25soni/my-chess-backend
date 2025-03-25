import express, { Request, Response } from "express";
import cors from "cors";

import { app, httpServer, PORT } from "./libs/socketSetup";

app.use(cors());
app.use(express.json());

app.post("/create-room", (req: Request, res: Response) => {
  res.send("Create room and req body is " + JSON.stringify(req.body));
});
app.get("/", (req: Request, res: Response) => {
  res.send("sdlkfhlskdfjhsdkljfh");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
