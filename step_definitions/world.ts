import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import config from "config";
import { UserConfigPaths } from "../constants/users.constants";
import { TeacherDb } from "../db/teacher.db";

export class CustomWorld extends World {
  currentUser: Record<string, string>;
  teacherDb: TeacherDb;

  constructor(options: IWorldOptions) {
    super(options);
    this.currentUser = config.get<Record<string, string>>(
      UserConfigPaths.DEFAULT_USER,
    );
    this.teacherDb = new TeacherDb();
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
  }
}

setWorldConstructor(CustomWorld);
