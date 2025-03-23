import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
