import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import {router} from "../src/routers/mainRouter"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});