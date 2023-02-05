import NodeCache from "node-cache";
import { LoggingService } from "../services/logging.service";

export class BaseController {
  _loggingService: LoggingService;
  _myCache: NodeCache;
  constructor(public LoggingService: LoggingService) {
    this._loggingService = LoggingService;
    this._myCache = new NodeCache();
  }
}
