import { Before, After, setWorldConstructor } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { logScenarioName } from "../../utils/logger.utils";

setWorldConstructor(CustomWorld);

Before((scenario) => {
  const scenarioName = scenario.pickle.name;
  logScenarioName(scenarioName);
});

After(async function (this: CustomWorld) {
  await this.closeDbs();
});
