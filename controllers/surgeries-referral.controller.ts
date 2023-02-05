import { Service } from "typedi";
import { SurgeriesReferralQueries } from "../queries/surgeries-referral.queries";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";

@Service()
export class SurgeriesReferralController extends BaseController {
  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  private data: SurgeryReferral[] = [];

  async list(): Promise<SurgeryReferral[]> {
    if (this.data.length != 0) return this.data;

    let ret = await execute<any>(
      SurgeriesReferralQueries.SurgeriesReferralList,
      []
    );

    let obj = JSON.parse(ret[0].data);

    let refs: SurgeryReferral[] = [];

    obj.PediatricSurgeries.forEach(
      (element: { Scope: any; Referral: any; Observations: any }) => {
        refs.push({
          scope: element.Scope,
          referral: element.Referral,
          observations: element.Observations,
        });
      }
    );

    this.data = refs;

    return this.data;
  }
}
