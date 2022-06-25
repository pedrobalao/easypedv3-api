import { LoggingService } from "../services/logging.service";

export class BaseController {
  _loggingService: LoggingService;
  constructor(public LoggingService: LoggingService) {
    this._loggingService = LoggingService;
  }
}
