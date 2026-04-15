import { Before, After, setWorldConstructor } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { logScenarioName } from "../../utils/logger.utils";
import { TeacherDb } from "../../db/teacher.db";
import { HTTP_STATUS } from "../../constants/api.constants";

setWorldConstructor(CustomWorld);

Before((scenario) => {
  const scenarioName = scenario.pickle.name;
  logScenarioName(scenarioName);
});

After(async function (this: CustomWorld) {
  this.seededTeacher &&
    (await this.teacherDb.deleteById(this.seededTeacher.id));
  this.addedClass?.response.statusCode === HTTP_STATUS.CREATED &&
    (await this.classDb.deleteById(this.addedClass.response.body.data.id));
  this.seededClass && (await this.classDb.deleteById(this.seededClass.id));
  await this.closeDbs();
});
