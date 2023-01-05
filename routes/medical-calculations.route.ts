import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { MedicalCalculationsController } from "../controllers/medical-calculations.controller";

export default class MedicalCalculationsRoutes {
  static routes(): Router {
    var router = express.Router();
    const medicalCalculationsController = Container.get(
      MedicalCalculationsController
    );

    router.get("/", async (req: Request, res: Response) => {
      try {
        //const search: string = req.query.search as string;

        let ret = await medicalCalculationsController.list();

        // if (search) {
        //   diseases = await diseasesController.search(search);
        // } else {
        //   diseases = await diseasesController.list();
        // }

        res.status(200).json(ret);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.get(
      "/:medicalCalculationId",
      async (req: Request, res: Response) => {
        try {
          var idStr = req.params["medicalCalculationId"];

          var id: number = -1;

          try {
            id = parseInt(idStr, 10);
          } catch {
            throw new HttpRespException("Invalid id", 400);
          }

          var ret = await medicalCalculationsController.read(id);

          res.status(200).json(ret);
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
