import { Logger } from "tslog";
import { Service } from "typedi";

@Service()
export class LoggingService extends Logger {}
