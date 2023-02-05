import { Service } from "typedi";
import { SurgeriesReferralQueries } from "../queries/surgeries-referral.queries";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";
import { Congress } from "../models/congress.model";
import { CongressQueries } from "../queries/congress.queries";

@Service()
export class CongressesController extends BaseController {
  private readonly _cacheKey = "congresses";

  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async list(): Promise<Congress[]> {
    let ret: Congress[] = [];

    let retCache = this._myCache.get<Congress[]>(this._cacheKey);
    if (retCache == undefined) {
      ret = await execute<Congress[]>(CongressQueries.List, []);
      this._myCache.set<Congress[]>(this._cacheKey, ret, 3600);
    } else {
      ret = retCache;
    }

    return ret;
  }
}
