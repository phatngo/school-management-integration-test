import { readFileSync } from "node:fs";

export const readJSONFile = (filePath: string) => {
  const txtFile = readFileSync(filePath, "utf-8");
  return JSON.parse(txtFile);
};
