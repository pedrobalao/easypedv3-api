import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { CongressesController } from "../controllers/congresses.controller";

export default class CongressesRoutes {
  static routes(): Router {
    var router = express.Router();
    const congressesController = Container.get(CongressesController);

    router.get("/", async (req: Request, res: Response) => {
      try {
        let items = await congressesController.list();

        res.status(200).json(items);
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
