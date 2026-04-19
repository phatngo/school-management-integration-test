import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import config from "config";
import { UserConfigPaths } from "../../constants/users.constants";
import { TeacherDb } from "../../db/teacher.db";
import { ClassDb } from "../../db/class.db";
import { StudentDb } from "../../db/student.db";
import { TeacherDBSchema } from "../../types/db/teacher.db.types";
import { RequestInfo } from "../../types/api/common.api.types";
import { ClassDBSchema } from "../../types/db/class.db.types";

export class CustomWorld extends World {
  currentUser: Record<string, string>;
  teacherDb: TeacherDb;
  classDb: ClassDb;
  studentDb: StudentDb;
  addedClass: RequestInfo | undefined = undefined;
  seededTeacher: TeacherDBSchema | undefined;
  seededClass: ClassDBSchema | undefined;

  constructor(options: IWorldOptions) {
    super(options);
    this.currentUser = config.get<Record<string, string>>(
      UserConfigPaths.DEFAULT_USER,
    );
    this.teacherDb = new TeacherDb();
    this.classDb = new ClassDb();
    this.studentDb = new StudentDb();
    this.addedClass = undefined;
    this.seededTeacher = undefined;
    this.seededClass = undefined;
  }

  chooseUser(user: string) {
    const userConfig = config.get<Record<string, string>>(`users.${user}`);
    if (!userConfig) {
      throw new Error(`User "${user}" is not defined in the configuration.`);
    }
    this.currentUser = userConfig;
  }

  async getDuplicateClassName() {
    if (!this.seededClass) {
      throw new Error("No seeded class found to get duplicate class name.");
    }
    const data = await this.classDb.getNotById(this.seededClass.id);

    if (data && data.length > 0) {
      return data[0].name;
    } else {
      return null;
    }
  }

  async closeDbs() {
    await this.teacherDb.close();
    await this.classDb.close();
    await this.studentDb.close();
  }
}

setWorldConstructor(CustomWorld);
