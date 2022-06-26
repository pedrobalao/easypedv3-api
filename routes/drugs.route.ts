import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { DrugsController } from "../controllers/drugs.controller";
import { CalculationInput } from "../models/drug.model";
import { HttpRespException } from "../models/resource-not-found-error.model";

export default class DrugsRoutes {
  static routes(): Router {
    var router = express.Router();
    const drugController = Container.get(DrugsController);

    router.get("/", async (req: Request, res: Response) => {
      if (!req.query["searchtoken"]) {
        res.status(400).send("Query parameter searchtoken is mandatory");
        return;
      }

      var token = req.query["searchtoken"]?.toString();
      var result = await drugController.search(token);

      res.status(200).json(result);
    });

    router.get("/:drugId", async (req: Request, res: Response) => {
      try {
        var drugIdStr = req.params["drugId"];

        var drugId: number = -1;

        try {
          drugId = parseInt(drugIdStr, 10);
        } catch {
          throw new HttpRespException("Invalid drugId", 400);
        }

        var drug = await drugController.read(drugId);

        res.status(200).json(drug);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.post(
      "/:drugId/calculations",
      async (req: Request, res: Response) => {
        try {
          var drugIdStr = req.params["drugId"];

          var drugId: number = -1;

          try {
            drugId = parseInt(drugIdStr, 10);
          } catch {
            throw new HttpRespException("Invalid drugId", 400);
          }

          var data: CalculationInput[];
          try {
            data = req.body as CalculationInput[];
          } catch (error) {
            throw new HttpRespException("Invalid payload", 400);
          }

          var calcsResult = await drugController.calculate(drugId, data);

          res.status(200).json(calcsResult);
        } catch (error) {
          if (error instanceof HttpRespException) {
            res.status(error.httpCode).send(error.message);
            return;
          }
          res.status(500).send(error);
        }
      }
    );

    return router;
  }
}
