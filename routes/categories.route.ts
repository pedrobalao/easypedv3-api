import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { DrugsController } from "../controllers/drugs.controller";
import { HttpRespException } from "../models/resource-not-found-error.model";

export default class CategoriesRoutes {
  static routes(): Router {
    var router = express.Router();
    const drugController = Container.get(DrugsController);

    router.get("/", async (req: Request, res: Response) => {
      try {
        var drugs = await drugController.categoriesList();

        res.status(200).json(drugs);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.get(
      "/:categoryId/sub-categories",
      async (req: Request, res: Response) => {
        try {
          var categoryIdStr = req.params["categoryId"];

          var categoryId: number = -1;

          try {
            categoryId = parseInt(categoryIdStr, 10);
          } catch {
            throw new HttpRespException("Invalid drugId", 400);
          }
          var subcategories = await drugController.subCategoriesList(
            categoryId
          );

          res.status(200).json(subcategories);
        } catch (error) {
          if (error instanceof HttpRespException) {
            res.status(error.httpCode).send(error.message);
            return;
          }
          res.status(500).send(error);
        }
      }
    );

    router.get(
      "/:categoryId/sub-categories/:subCategoryId/drugs",
      async (req: Request, res: Response) => {
        try {
          var categoryIdStr = req.params["categoryId"];

          var categoryId: number = -1;

          try {
            categoryId = parseInt(categoryIdStr, 10);
          } catch {
            throw new HttpRespException("Invalid categoryId", 400);
          }

          var subCategoryIddStr = req.params["subCategoryId"];

          var subCategoryId: number = -1;

          try {
            subCategoryId = parseInt(subCategoryIddStr, 10);
          } catch {
            throw new HttpRespException("Invalid subCategoryId", 400);
          }

          var drugs = await drugController.drugsBySubCategoryId(subCategoryId);

          res.status(200).json(drugs);
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
