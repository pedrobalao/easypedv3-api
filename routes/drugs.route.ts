import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { DrugsController } from "../controllers/drugs.controller";

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
      var drugIdStr = req.params["drugId"];

      var drugId: number = -1;

      try {
        drugId = parseInt(drugIdStr, 10);
      } catch {
        res.status(400).send("Invalid drugId");
      }

      var drug = await drugController.read(drugId);

      if (drug == null) {
        res.status(404).send("Resource not found");
      }

      res.status(200).json(drug);
    });

    return router;
  }
}
