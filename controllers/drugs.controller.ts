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
import { DrugsQueries } from "../queries/drugs.queries";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";

@Service()
export class DrugsController extends BaseController {
  private readonly _cacheCategoriesKey = "categories";
  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async search(search: String): Promise<Drug[]> {
    let ret: Drug[] = [];

    ret = await execute<Drug[]>(DrugsQueries.SearchDrugs, [
      search,
      search,
      search,
    ]);

    return ret;
  }

  async read(drugId: number): Promise<Drug> {
    let drug: Drug;

    var drugs = await execute<Drug[]>(DrugsQueries.DrugById, [drugId]);

    if (drugs == null || drugs.length == 0) {
      throw new HttpRespException("NO_DATA_FOUND", 400);
    }

    drug = drugs[0];

    var indicationProm = execute<Indication[]>(DrugsQueries.IndicationsbyDrug, [
      drugId,
    ]);
    var variablesProm = execute<Variable[]>(DrugsQueries.VariablesByDrug, [
      drugId,
    ]);
    var calculationsProm = execute<Calculation[]>(
      DrugsQueries.CalculationsByDrug,
      [drugId]
    );

    var resultsProms = await Promise.all([
      indicationProm,
      variablesProm,
      calculationsProm,
    ]);

    drug.calculations = resultsProms[2];
    drug.variables = resultsProms[1];
    drug.indications = resultsProms[0];

    if (drug.indications != null && drug.indications.length > 0) {
      var dosesProms: Promise<Dose[]>[] = [];
      drug.indications.forEach((element) => {
        dosesProms.push(
          execute<Dose[]>(DrugsQueries.DosesByIndication, [element.id])
        );
      });

      if (dosesProms.length > 0) {
        var dosesResults = await Promise.all(dosesProms);
        for (let index = 0; index < dosesResults.length; index++) {
          drug.indications[index].doses = dosesResults[index];
        }
      }
    }

    return drug;
  }

  async calculate(
    drugId: number,
    data: CalculationInput[]
  ): Promise<CalculationResult[]> {
    var calculations = await execute<Calculation[]>(
      DrugsQueries.CalculationsByDrug,
      [drugId]
    );

    if (calculations.length == 0) {
      throw new HttpRespException(
        "No calculations available for the drug",
        400
      );
    }

    var ret: CalculationResult[] = [];

    calculations.forEach((element) => {
      var resultFunc = this.calculateInner(data, element.function);

      ret.push({
        result: resultFunc,
        id: element.id,
        description: element.description,
        resultDescription: element.resultDescription,
        resultIdUnit: element.resultIdUnit,
      });
    });

    return ret;
    // calculation
  }

  calculateInner(data: CalculationInput[], formula: String): any {
    var vars = "";

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

  async userFavourites(userId: String): Promise<Drug[]> {
    let ret: Drug[] = [];

    ret = await execute<Drug[]>(DrugsQueries.DrugFavourtiresByUserId, [userId]);

    return ret;
  }

  async addUserFavourites(userId: String, drugId: number): Promise<boolean> {
    try {
      const result = await execute<{ affectedRows: number }>(
        DrugsQueries.AddUserFavourite,
        [userId, drugId]
      );
      return result.affectedRows > 0;
    } catch {
      throw new HttpRespException("Invalid input", 400);
    }
  }

  async deleteUserFavourites(userId: String, drugId: number): Promise<boolean> {
    try {
      const result = await execute<{ affectedRows: number }>(
        DrugsQueries.DeleteUserFavourite,
        [userId, drugId]
      );
      return result.affectedRows > 0;
    } catch {
      throw new HttpRespException("Invalid input", 400);
    }
  }

  async isUserFavourite(userId: String, drugId: number): Promise<boolean> {
    try {
      const result = await execute<{ isFavourite: number }[]>(
        DrugsQueries.IsUserFavourite,
        [userId, drugId]
      );

      return result[0].isFavourite > 0;
    } catch {
      throw new HttpRespException("Drug is not a user favourite", 404);
    }
  }

  async categoriesList(): Promise<Category[]> {
    let ret: Category[] = [];

    let retCache = this._myCache.get<Category[]>(this._cacheCategoriesKey);
    if (retCache == undefined) {
      ret = await execute<Category[]>(DrugsQueries.CategoriesList, []);
      this._myCache.set<Category[]>(this._cacheCategoriesKey, ret, 3600);
    } else {
      ret = retCache;
    }

    return ret;
  }

  async subCategoriesList(categoryId: number): Promise<SubCategory[]> {
    let ret: SubCategory[] = [];

    ret = await execute<SubCategory[]>(DrugsQueries.SubCategoriesByCategoryId, [
      categoryId,
    ]);

    return ret;
  }

  async drugsBySubCategoryId(subCategoryId: number): Promise<Drug[]> {
    let ret: Drug[] = [];

    ret = await execute<Drug[]>(DrugsQueries.DrugsBySubCategoryId, [
      subCategoryId,
    ]);

    return ret;
  }
}
