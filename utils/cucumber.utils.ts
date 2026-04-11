import { IWorld } from "@cucumber/cucumber";

export function parseDataTable(
  rawTable: any,
  world: IWorld | null = null,
): Record<string, string | number | boolean | null | undefined> {
  return Object.fromEntries(
    (rawTable as string[][]).map(([key, value]) => [
      key,
      convertDataTableValue(value, world),
    ]),
  );
}

function convertDataTableValue(
  value: string,
  world: IWorld | null = null,
): string | number | boolean | null | undefined {
  if (value === "empty") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (value === "undefined") return undefined;
  if (value === "{exisitingTeacherId}")
    return world ? world.seededTeacher.id : undefined;

  const numeric = Number(value);
  if (!isNaN(numeric) && value.trim() !== "") return numeric;

  return value;
}
