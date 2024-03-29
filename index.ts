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
import UsersRoutes from "./routes/users.route";
import CategoriesRoutes from "./routes/categories.route";
import SurgeriesReferralRoutes from "./routes/surgeries-referral.route";
import DiseasesRoutes from "./routes/diseases.route";
import MedicalCalculationsRoutes from "./routes/medical-calculations.route";
import PercentilesRoutes from "./routes/percentiles.route";
import CongressesRoutes from "./routes/congresses.route";
import NewsRoutes from "./routes/news.route";
import { cert } from "firebase-admin/app";
import fs from "fs";
import EmergencyRoutes from "./routes/emergency.route";

dotenv.config();

if (!fs.existsSync("firebase_key.json")) {
  let GACB64: string = process.env.GOOGLE_APPLICATION_CREDENTIALS_B64 ?? "";

  if (GACB64 == "") {
    console.error("Missing env var GOOGLE_APPLICATION_CREDENTIALS_B64");
    throw Error("Invalid GOOGLE_APPLICATION_CREDENTIALS_B64");
  }

  let buff = Buffer.from(GACB64, "base64");
  fs.writeFileSync("firebase_key.json", buff);

  console.log("file firebase_key.json created");
} else {
  console.log("file firebase_key.json already exists");
}

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "firebase_key.json";

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
app.use("/api/users", UsersRoutes.routes());
app.use("/api/categories", CategoriesRoutes.routes());
app.use("/api/surgeries-referral", SurgeriesReferralRoutes.routes());
app.use("/api/diseases", DiseasesRoutes.routes());
app.use("/api/medical-calculations", MedicalCalculationsRoutes.routes());
app.use("/api/percentiles", PercentilesRoutes.routes());
app.use("/api/congresses", CongressesRoutes.routes());
app.use("/api/news", NewsRoutes.routes());
app.use("/api/emergency", EmergencyRoutes.routes());

app.get("/", (req: Request, res: Response) => {
  res.send("Ups...this is the root endpoint");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
