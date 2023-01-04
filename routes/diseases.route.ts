import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { DiseasesController } from "../controllers/diseases.controller";

export default class DiseasesRoutes {
  static routes(): Router {
    var router = express.Router();
    const diseasesController = Container.get(DiseasesController);

    router.get("/", async (req: Request, res: Response) => {
      try {
        const search: string = req.query.search as string;

        let diseases;

        if (search) {
          diseases = await diseasesController.search(search);
        } else {
          diseases = await diseasesController.list();
        }

        res.status(200).json(diseases);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.get("/:diseaseId", async (req: Request, res: Response) => {
      try {
        var idStr = req.params["diseaseId"];

        var id: number = -1;

        try {
          id = parseInt(idStr, 10);
        } catch {
          throw new HttpRespException("Invalid id", 400);
        }

        var disease = await diseasesController.read(id);

        res.status(200).json(disease);
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
