import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
//import { initializeApp, applicationDefault } from "firebase-admin/app";
import * as MySQLConnector from "./utils/mysql.connector";
import compression from "compression";
import cors from "cors";
import errorHandler from "./middlewares/error-handler.middleware";
import logger from "./middlewares/logger.middleware";
import checkAuthToken from "./middlewares/firebase-auth.middleware";

import DrugsRoutes from "./routes/drugs.route";
import * as admin from "firebase-admin";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://easyped-894ba.firebaseio.com",
});

const app: Express = express();
const port = process.env.PORT ?? 3000;

// create database pool
MySQLConnector.init();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(checkAuthToken);
app.use(logger); 

app.use("/api/drugs", DrugsRoutes.routes());
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
