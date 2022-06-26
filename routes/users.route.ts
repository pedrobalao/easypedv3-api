import express, { Express, Request, Response, Router } from "express";
import Container from "typedi";
import { DrugsController } from "../controllers/drugs.controller";
import { CalculationInput, FavouriteDrugInput } from "../models/drug.model";
import { HttpRespException } from "../models/resource-not-found-error.model";

export default class UsersRoutes {
  static routes(): Router {
    var router = express.Router();
    const drugController = Container.get(DrugsController);

    router.get("/me/favourite-drugs", async (req: Request, res: Response) => {
      try {
        var drugs = await drugController.userFavourites(req.authID!.toString());

        res.status(200).json(drugs);
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.post("/me/favourite-drugs", async (req: Request, res: Response) => {
      try {
        var data = req.body as FavouriteDrugInput;

        var inserted = await drugController.addUserFavourites(
          req.authID!.toString(),
          data.drugId
        );

        res.status(201).send("created");
      } catch (error) {
        if (error instanceof HttpRespException) {
          res.status(error.httpCode).send(error.message);
          return;
        }
        res.status(500).send(error);
      }
    });

    router.delete(
      "/me/favourite-drugs/:drugId",
      async (req: Request, res: Response) => {
        try {
          var drugIdStr = req.params["drugId"];

          var drugId: number = -1;

          try {
            drugId = parseInt(drugIdStr, 10);
          } catch {
            throw new HttpRespException("Invalid drugId", 400);
          }

          var drug = await drugController.deleteUserFavourites(
            req.authID!.toString(),
            drugId
          );

          res.status(204).json("Resource deleted successfully");
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
      "/me/favourite-drugs/:drugId",
      async (req: Request, res: Response) => {
        try {
          var drugIdStr = req.params["drugId"];

          var drugId: number = -1;

          try {
            drugId = parseInt(drugIdStr, 10);
          } catch {
            throw new HttpRespException("Invalid drugId", 400);
          }
          var isFavourite = await drugController.isUserFavourite(
            req.authID!.toString(),
            drugId
          );
          if (isFavourite) {
            res.status(200).send("Drug is a user's favourite");
          } else {
            res.status(404).send("Favourite not found");
          }
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
