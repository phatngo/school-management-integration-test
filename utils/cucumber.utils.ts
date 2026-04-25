import { IWorld } from "@cucumber/cucumber";

export async function parseDataTable(
  rawTable: any,
  world: IWorld | null = null,
): Promise<Record<string, string | number | boolean | null | undefined>> {
  const entries = await Promise.all(
    (rawTable as string[][]).map(async ([key, value]) => [
      key,
      await convertDataTableValue(value, world),
    ]),
  );
  return Object.fromEntries(entries);
}

async function convertDataTableValue(
  value: string,
  world: IWorld | null = null,
): Promise<string | number | boolean | null | undefined> {
  if (value === "empty") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (value === "undefined") return undefined;
  if (value === "{exisitingTeacherId}")
    return world ? world.seededTeacher.id : undefined;
  if (value === "{existingClassId}")
    return world ? world.seededClass.id : undefined;
  if (value === "{duplicateClassName}")
    return world ? await world.getDuplicateClassName() : undefined;

  if (isPhoneNumber(value)) return value;

  const numeric = Number(value);
  if (!isNaN(numeric) && value.trim() !== "") return numeric;
  return value;
}

function isPhoneNumber(value: string): boolean {
  // Matches: +84..., 0..., or patterns with common phone formatting
  return /^(\+\d{1,3}|0)\d{6,14}$/.test(value.trim());
}
