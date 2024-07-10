import { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const port: number = parseInt(process.env.PORT || "3000", 10);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
