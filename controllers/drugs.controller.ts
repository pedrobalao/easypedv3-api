import { Container, Service } from "typedi";
import {
  Calculation,
  Dose,
  Drug,
  Indication,
  Variable,
} from "../models/drug.model";
import { DrugsQueries } from "../queries/drugs.queries";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";

@Service()
export class DrugsController {
  constructor(public LoggingService: LoggingService) {}

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

    drug = await execute<Drug>(DrugsQueries.DrugById, [drugId]);

    if (drug == null) {
      return drug;
    }

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
}
