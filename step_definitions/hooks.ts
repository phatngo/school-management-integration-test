import { BeforeAll, After, setWorldConstructor } from "@cucumber/cucumber";
import { CustomWorld } from "./world";

setWorldConstructor(CustomWorld);

// BeforeAll(() => {
//   // Nothing to do here for now
// });

After(async function (this: CustomWorld) {
  await this.closeDbs();
});
