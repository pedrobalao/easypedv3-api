import { Service } from "typedi";
import { LoggingService } from "../services/logging.service";
import { execute } from "../utils/mysql.connector";
import { BaseController } from "./base.controller";
import { News } from "../models/news.model";
import { NewsQueries } from "../queries/news.queries";
import NodeCache from "node-cache";

@Service()
export class NewsController extends BaseController {
  private readonly _cacheKey = "news";
  constructor(public LoggingService: LoggingService) {
    super(LoggingService);
  }

  async list(): Promise<News[]> {
    let ret: News[] = [];

    let retCache = this._myCache.get<News[]>(this._cacheKey);
    if (retCache == undefined) {
      ret = await execute<News[]>(NewsQueries.List, []);
      this._myCache.set<News[]>(this._cacheKey, ret, 3600);
    } else {
      ret = retCache;
    }

    return ret;
  }
}
