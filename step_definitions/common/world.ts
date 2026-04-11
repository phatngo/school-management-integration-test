import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import config from "config";
import { UserConfigPaths } from "../../constants/users.constants";
import { TeacherDb } from "../../db/teacher.db";
import { ClassDb } from "../../db/class.db";
import { TeacherDBSchema } from "../../types/db/teacher.db.types";
import { RequestInfo } from "../../types/api/common.api.types";

export class CustomWorld extends World {
  currentUser: Record<string, string>;
  teacherDb: TeacherDb;
  classDb: ClassDb;
  addedClass: RequestInfo | undefined = undefined;
  seededTeacher: TeacherDBSchema | undefined;

  constructor(options: IWorldOptions) {
    super(options);
    this.currentUser = config.get<Record<string, string>>(
      UserConfigPaths.DEFAULT_USER,
    );
    this.teacherDb = new TeacherDb();
    this.classDb = new ClassDb();
    this.addedClass = undefined;
    this.seededTeacher = undefined;
  }

  chooseUser(user: string) {
    const userConfig = config.get<Record<string, string>>(`users.${user}`);
    if (!userConfig) {
      throw new Error(`User "${user}" is not defined in the configuration.`);
    }
    this.currentUser = userConfig;
  }

  async closeDbs() {
    await this.teacherDb.close();
    await this.classDb.close();
  }
}

setWorldConstructor(CustomWorld);
