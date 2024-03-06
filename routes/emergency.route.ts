import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { CalculationInput } from "../models/drug.model";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { EmergencyController } from "../controllers/emergency.controller";
import { Variables } from "../models/common.model";

export default class EmergencyRoutes {
  static routes(): Router {
    var router = express.Router();
    const emergencyController = Container.get(EmergencyController);

    router.post("/drugs/calculation", async (req: Request, res: Response) => {
      try {
        var data: CalculationInput[];
        try {
          data = req.body as CalculationInput[];
        } catch (error) {
          throw new HttpRespException("Invalid payload", 400);
        }

        var calcsResult = await emergencyController.calculate(data);

        res.status(200).json(calcsResult);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    return router;
  }
}
