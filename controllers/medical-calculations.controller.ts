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
import { CalculationInput, CalculationResult } from "../models/drug.model";
import { round } from "../utils/math.utils";

@Service()
export class MedicalCalculationsController extends BaseController {
  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async list(): Promise<MedicalCalculation[]> {
    //let ret: MedicalCalculation[] = [];

    let ret = await execute<MedicalCalculation[]>(
      MedicalCalculationsQueries.List,
      []
    );

    ret.forEach((element) => {
      delete element["formula"];
    });

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
        var queryVals = await execute<any>(
          MedicalCalculationsVariablesQueries.ListVariableValues,
          [element.variableId]
        );
        element.values = queryVals.map((item: { value: any }) => {
          return item.value;
        });
      }
    }

    delete ret["formula"];
    ret.variables = queryVars;

    return ret;
  }

  async calculate(
    medicalCalculationId: number,
    data: CalculationInput[]
  ): Promise<CalculationResult> {
    let medicalcalculationArr = await execute<MedicalCalculation[]>(
      MedicalCalculationsQueries.Read,
      [medicalCalculationId]
    );

    if (medicalcalculationArr.length == 0) {
      throw new HttpRespException("Invalid Medical Calculation id", 400);
    }

    let medicalcalculation = medicalcalculationArr[0];

    let result = this.calculateInner(data, medicalcalculation.formula!);
    let ret: CalculationResult;

    if (medicalcalculation.resultType == "NUMBER") {
      ret = {
        id: medicalcalculation.id,
        description: medicalcalculation.description,
        resultDescription: medicalcalculation.description,
        resultIdUnit: medicalcalculation.resultUnitId,
        result: round(result, medicalcalculation.precision ?? 2),
      };
    } else {
      ret = {
        id: medicalcalculation.id,
        description: medicalcalculation.description,
        resultDescription: medicalcalculation.description,
        resultIdUnit: medicalcalculation.resultUnitId,
        result: result,
      };
    }

    return ret;
    // calculation
  }

  calculateInner(data: CalculationInput[], formula: String): any {
    var vars = "";
    console.log("formula 1-> " + formula);

    data.forEach((element) => {
      if (isNaN(element.value)) {
        vars = vars + "var " + element.variable + '="' + element.value + '";\n';
      } else {
        vars = vars + "var " + element.variable + "=" + element.value + ";\n";
      }
    });

    this._loggingService.debug("vars -> " + vars);
    vars = vars + formula;

    console.log("formula -> " + vars);
    this._loggingService.debug("vars -> " + vars);
    return eval(vars);
  }
}
