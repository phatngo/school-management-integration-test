import { setWorldConstructor } from "@cucumber/cucumber";
import pactum from "pactum";

export class CustomWorld {
  spec = pactum.spec();
  constructor() {
    this.spec = pactum.spec();
    console.dir(this.spec);
  }
}
setWorldConstructor(CustomWorld);
