import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { DiseasesController } from "../controllers/diseases.controller";
import { PercentilesController } from "../controllers/percentiles.controller";
import {
  BMIInput,
  BMIOutput,
  PercentileInput,
} from "../models/percentile.model";

export default class PercentilesRoutes {
  static routes(): Router {
    var router = express.Router();
    const controller = Container.get(PercentilesController);

    router.post("/length", async (req: Request, res: Response) => {
      try {
        var data: PercentileInput;
        try {
          data = req.body as PercentileInput;
        } catch (error) {
          throw new HttpRespException("Invalid payload", 400);
        }

        var calcsResult = await controller.Read("LENGTH", data);

        res.status(200).json(calcsResult);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.post("/weight", async (req: Request, res: Response) => {
      try {
        var data: PercentileInput;
        try {
          data = req.body as PercentileInput;
        } catch (error) {
          throw new HttpRespException("Invalid payload", 400);
        }

        var calcsResult = await controller.Read("WEIGHT", data);

        res.status(200).json(calcsResult);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.post("/bmi", async (req: Request, res: Response) => {
      try {
        var data: BMIInput;
        try {
          data = req.body as BMIInput;
        } catch (error) {
          throw new HttpRespException("Invalid payload", 400);
        }

        var calcsResult = await controller.BMI(data);

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
