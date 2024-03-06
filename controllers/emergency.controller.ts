import { Container, Service } from "typedi";
import {
  EmergencyDrugs,
  EmergencyDrugsCalculationResult,
} from "../models/emergency.model";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { EmergencyQueries } from "../queries/emergency.queries";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";
import { Variables } from "../models/common.model";
import { CalculationInput } from "../models/drug.model";
import { calculateInner } from "../utils/calculations.utils";

@Service()
export class EmergencyController extends BaseController {
  private readonly _cacheKey = "emergencyDrugs";

  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async calculate(
    variables: CalculationInput[]
  ): Promise<EmergencyDrugsCalculationResult[]> {
    let items: EmergencyDrugs[];

    let retCache = this._myCache.get<EmergencyDrugs[]>(this._cacheKey);
    if (retCache == undefined) {
      items = await execute<EmergencyDrugs[]>(
        EmergencyQueries.EmergencyDrugs,
        []
      );
      this._myCache.set<EmergencyDrugs[]>(this._cacheKey, items, 3600);
    } else {
      items = retCache;
    }

    let ret: EmergencyDrugsCalculationResult[] = [];

    items.forEach((element) => {
      let result = calculateInner(variables, element.formula);
      let calcResult: EmergencyDrugsCalculationResult = {
        ...element,
        result: result,
      };
      ret.push(calcResult);
    });

    return ret;
  }
}
