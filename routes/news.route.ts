import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { NewsController } from "../controllers/news.controller";

export default class NewsRoutes {
  static routes(): Router {
    var router = express.Router();
    const newsController = Container.get(NewsController);

    router.get("/", async (req: Request, res: Response) => {
      try {
        let items = await newsController.list();

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
