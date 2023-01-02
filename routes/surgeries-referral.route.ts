import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { DrugsController } from "../controllers/drugs.controller";
import { SurgeriesReferralController } from "../controllers/surgeries-referral.controller";
import { CalculationInput } from "../models/drug.model";
import { HttpRespException } from "../models/resource-not-found-error.model";

export default class SurgeriesReferralRoutes {
  static routes(): Router {
    var router = express.Router();
    const surgeriesController = Container.get(SurgeriesReferralController);

    router.get("/", async (req: Request, res: Response) => {
      var result = await surgeriesController.list();

      res.status(200).json(result);
    });

    return router;
  }
}
