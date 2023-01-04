import { Container, Service } from "typedi";
import {
  Calculation,
  CalculationInput,
  CalculationResult,
  Category,
  Dose,
  Drug,
  Indication,
  SubCategory,
  Variable,
} from "../models/drug.model";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { DiseasesQueries } from "../queries/diseases.queries";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";
import { Disease } from "../models/disease.model";

@Service()
export class DiseasesController extends BaseController {
  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async list(): Promise<Disease[]> {
    let ret: Disease[] = [];

    ret = await execute<Disease[]>(DiseasesQueries.List, []);

    return ret;
  }

  async search(search: String): Promise<Disease[]> {
    let ret: Disease[] = [];

    search = search.replace(/[^a-zA-Z0-9 ]/g, "");

    if (search.length == 0) return [];

    let words = search.split(" ");

    words = words.map((value) => {
      return "+*" + value + "*";
    });
    search = words.join("");

    this._loggingService.debug("query: " + search);

    ret = await execute<Disease[]>(DiseasesQueries.Search, [search]);

    return ret;
  }

  async read(id: number): Promise<Disease> {
    let disease: Disease;

    var queryRet = await execute<Disease[]>(DiseasesQueries.Read, [id]);

    if (queryRet == null || queryRet.length == 0) {
      throw new HttpRespException("NO_DATA_FOUND", 400);
    }

    disease = queryRet[0];
    disease.treatment = JSON.parse(queryRet[0].treatmentstr!);
    delete disease["treatmentstr"];
    return disease;
  }
}
