import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "./world";

Given(
  "I am authenticated as {string} user",
  async function (this: CustomWorld, user: string) {
    this.chooseUser(user);
  },
);
