import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import config from "config";
import { UserConfigPaths } from "../constants/users.constants";

export class CustomWorld extends World {
  currentUser: Record<string, string>;

  constructor(options: IWorldOptions) {
    super(options);
    this.currentUser = config.get<Record<string, string>>(UserConfigPaths.DEFAULT_USER);
  }

  chooseUser(userConfigPath: string) {
    const userConfig = config.get<Record<string, string>>(userConfigPath);
    if (!userConfig) {
      throw new Error(`User "${userConfigPath}" is not defined in the configuration.`);
    }
    this.currentUser = userConfig;
  }
}

setWorldConstructor(CustomWorld);