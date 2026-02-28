import config from "config";
import { TeacherService } from "../api/teacher.service";

export function parseDataTable(
  rawTable: any,
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    (rawTable as string[][]).map(([key, value]) => [
      key,
      convertDataTableValue(value),
    ]),
  );
}

function convertDataTableValue(value: string): string | number | boolean {
  if (value === "<empty>") return "";
  if (value === "true") return true;
  if (value === "false") return false;

  const numeric = Number(value);
  if (!isNaN(numeric) && value.trim() !== "") return numeric;

  return value;
}

export function getTeacherService(
  userKey: string = "publicUsers.user1",
): TeacherService {
  return new TeacherService(config.get(userKey));
}

export function getAddedTeacherId(world: any): number {
  return world.addedTeacher?.response.body.data.id ?? -1;
}
