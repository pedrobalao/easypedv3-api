import { Service } from "typedi";
import { HttpRespException } from "../models/resource-not-found-error.model";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";
import {
  BMIInput,
  BMIOutput,
  PercentileInput,
  PercentileOutput,
} from "../models/percentile.model";
import { PercentilesQueries } from "../queries/percentiles.queries";
import { differenceInDays, differenceInMonths, parseISO, sub } from "date-fns";
import { calculatePercentile, round } from "../utils/math.utils";

@Service()
export class PercentilesController extends BaseController {
  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async Read(
    growType: String,
    percentileInput: PercentileInput
  ): Promise<PercentileOutput> {
    let qgender: String = "M";
    //let growType: String = "LENGTH";

    let birthdate: Date;
    try {
      birthdate = parseISO(percentileInput.birthdate);
    } catch (exc) {
      throw new HttpRespException("Invalid date", 400);
    }

    if (percentileInput.gender == "female") {
      qgender = "F";
    } else if (percentileInput.gender != "male") {
      throw new HttpRespException("Invalid gender", 400);
    }

    const now = new Date();
    if (birthdate > now || sub(now, { years: 18 }) > birthdate) {
      throw new HttpRespException("Invalid birthdate", 400);
    }

    let ageInDays = differenceInDays(now, birthdate);

    let searchAge: number = ageInDays;
    let agetype: string = "D";

    if (ageInDays >= 1856) {
      searchAge = differenceInMonths(now, birthdate);
      agetype = "M";
    }

    let retResult = await execute<any>(PercentilesQueries.Read, [
      growType,
      qgender,
      searchAge,
      agetype,
    ]);

    let resultAge = retResult[0];
    let percentile: number = 0.1;

    if (percentileInput.value <= Number(resultAge.P01)) {
      percentile = 0.1;
    } else if (percentileInput.value <= Number(resultAge.P1)) {
      percentile = 1;
    } else if (percentileInput.value <= Number(resultAge.P3)) {
      percentile = 3;
    } else if (percentileInput.value <= Number(resultAge.P5)) {
      percentile = 5;
    } else if (percentileInput.value <= Number(resultAge.P10)) {
      percentile = calculatePercentile(
        5,
        resultAge.P5,
        10,
        resultAge.P10,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P15)) {
      percentile = calculatePercentile(
        10,
        resultAge.P10,
        15,
        resultAge.P15,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P25)) {
      percentile = calculatePercentile(
        15,
        resultAge.P15,
        25,
        resultAge.P25,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P50)) {
      percentile = calculatePercentile(
        25,
        resultAge.P25,
        50,
        resultAge.P50,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P75)) {
      percentile = calculatePercentile(
        50,
        resultAge.P50,
        75,
        resultAge.P75,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P85)) {
      percentile = calculatePercentile(
        75,
        resultAge.P75,
        85,
        resultAge.P85,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P90)) {
      percentile = calculatePercentile(
        85,
        resultAge.P85,
        90,
        resultAge.P90,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P95)) {
      percentile = calculatePercentile(
        90,
        resultAge.P90,
        95,
        resultAge.P95,
        percentileInput.value
      );
    } else if (percentileInput.value < Number(resultAge.P97)) {
      percentile = 95;
    } else if (percentileInput.value < Number(resultAge.P99)) {
      percentile = 97;
    } else if (percentileInput.value < Number(resultAge.P999)) {
      percentile = 99;
    } else {
      percentile = 99.9;
    }

    const output = <PercentileOutput>{
      percentile: percentile,
      description: "",
    };

    return output;
  }
  async BMI(bmiInput: BMIInput): Promise<BMIOutput> {
    let bmiVal = round(
      bmiInput.weight / ((bmiInput.length / 100) * (bmiInput.length / 100)),
      2
    );

    let percInput: PercentileInput = {
      birthdate: bmiInput.birthdate,
      gender: bmiInput.gender,
      value: bmiVal,
    };

    let percentile = await this.Read("BMI", percInput);

    let result: string = "";
    if (percentile.percentile < 5) {
      result = "underweight";
    } else if (percentile.percentile >= 5 && percentile.percentile <= 85) {
      result = "healthy weight";
    } else if (percentile.percentile > 85 && percentile.percentile <= 95) {
      result = "overweight";
    } else {
      result = "obesity";
    }

    let ret: BMIOutput = {
      bmi: bmiVal,
      percentile: percentile.percentile,
      result: result,
    };

    return ret;
  }
}
