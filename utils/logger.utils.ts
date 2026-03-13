import log4js from "log4js";
import Spec from "pactum/src/models/Spec";

log4js.configure({
  appenders: { cheese: { type: "file", filename: `logs/${new Date().toISOString()}.log` } },
  categories: { default: { appenders: ["cheese"], level: "trace" } },
});

export function logScenarioName(scenarioName: string) {
  const logger = log4js.getLogger("cheese");
  logger.info(`Scenario: ${scenarioName}`);
}

export function logApiRequestInfo<T = null>(
  method: string,
  endpoint: string,
  specResponse: any,
  payload?: T,
) {
  const logger = log4js.getLogger("cheese");
  const apiInfo = {
    method,
    endpoint,
    responseBody: specResponse.body,
    payload: payload ? payload : null,
  };
  logger.debug("API Request Info:", `\t${JSON.stringify(apiInfo, null, 2)}`);
}
