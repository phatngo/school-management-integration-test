import log4js from "log4js";
import { loggerConfig } from "../config/logger.config";
import { ApiLog } from "../types/api/common.api.types";
import { DbQueryLog } from "../types/db/common.db.types";
import { PactResponse } from "../types/api/common.api.types";

log4js.configure(loggerConfig);
const logger = log4js.getLogger();

export function logScenarioName(scenarioName: string) {
  logger.info(`Scenario: ${scenarioName}`);
}

export function logApiRequestInfo<T = null>(
  method: string,
  endpoint: string,
  pactResponse: PactResponse,
  payload?: T,
) {
  const apiLog: ApiLog = {
    method,
    endpoint,
    responseCode: pactResponse.statusCode,
    responseBody: pactResponse.body,
    payload: payload ? payload : null,
  };
  logger.debug("API Request Info:", `\t${formatLog(apiLog)}`);
}

export function logDbQueryInfo<T = null>(
  query: string,
  params: any[] | null = null,
  result: T,
) {
  const dbLog: DbQueryLog = {
    query,
    params: params ? params : null,
    result,
  };
  logger.debug("DB Query Info:", `\t${formatLog(dbLog)}`);
}

function formatLog(logInfo: ApiLog | DbQueryLog) {
  return JSON.stringify(logInfo, null, 2);
}
