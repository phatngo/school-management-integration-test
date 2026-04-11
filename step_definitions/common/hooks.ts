import { Before, After, setWorldConstructor } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { logScenarioName } from "../../utils/logger.utils";
import { TeacherDb } from "../../db/teacher.db";

setWorldConstructor(CustomWorld);

Before((scenario) => {
  const scenarioName = scenario.pickle.name;
  logScenarioName(scenarioName);
});

After(async function (this: CustomWorld) {
  this.seededTeacher &&
    (await this.teacherDb.deleteById(this.seededTeacher.id));
  await this.closeDbs();
});

After("@removeClassAfterTest", async function (this: CustomWorld) {
  this.addedClass &&
    (await this.classDb.deleteById(this.addedClass.response.body.data.id));
});
