import { TeacherApi } from "../api/teacher.api";

export function parseDataTable(
  rawTable: any,
): Record<string, string | number | boolean | null | undefined> {
  return Object.fromEntries(
    (rawTable as string[][]).map(([key, value]) => [
      key,
      convertDataTableValue(value),
    ]),
  );
}

function convertDataTableValue(value: string): string | number | boolean | null | undefined {
  if (value === "empty") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (value === "undefined") return undefined;

  const numeric = Number(value);
  if (!isNaN(numeric) && value.trim() !== "") return numeric;

  return value;
}

export function getTeacherService(currentUser: {
  username: string;
  apiKey: string;
}): TeacherApi {
  return new TeacherApi(currentUser);
}

export function getAddedTeacherId(world: any): number {
  return world.addedTeacher?.response.body.data.id ?? -1;
}
