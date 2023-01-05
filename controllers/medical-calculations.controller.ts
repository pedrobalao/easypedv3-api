import { Service } from "typedi";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { DiseasesQueries } from "../queries/diseases.queries";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";
import { Disease } from "../models/disease.model";
import {
  MedicalCalculation,
  MedicalCalculationVariable,
} from "../models/medical-calculation.model";
import {
  MedicalCalculationsQueries,
  MedicalCalculationsVariablesQueries,
} from "../queries/medical-calculations.queries";

@Service()
export class MedicalCalculationsController extends BaseController {
  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async list(): Promise<MedicalCalculation[]> {
    let ret: MedicalCalculation[] = [];

    ret = await execute<MedicalCalculation[]>(
      MedicalCalculationsQueries.List,
      []
    );

    return ret;
  }

  async read(id: number): Promise<MedicalCalculation> {
    let ret: MedicalCalculation;

    var queryRet = await execute<MedicalCalculation[]>(
      MedicalCalculationsQueries.Read,
      [id]
    );

    if (queryRet == null || queryRet.length == 0) {
      throw new HttpRespException("NO_DATA_FOUND", 400);
    }

    ret = queryRet[0];

    var queryVars = await execute<MedicalCalculationVariable[]>(
      MedicalCalculationsVariablesQueries.ListVariables,
      [id]
    );

    if (queryVars == null || queryVars.length == 0) {
      throw new HttpRespException("Variables are missing", 400);
    }

    for (const element of queryVars) {
      if (element.type == "LISTVALUES") {
        var queryVals = await execute<string[]>(
          MedicalCalculationsVariablesQueries.ListVariableValues,
          [element.variableId]
        );
        element.values = queryVals;
      }
    }

    ret.variables = queryVars;

    return ret;
  }
}
