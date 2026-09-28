import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const databasePath = path.resolve(".data", "users.json");

export async function database() {
  try {
    const data = await readFile(databasePath, "utf8");
    return JSON.parse(data);
  } catch {
    return { users: [] };
  }
}

export async function save(databaseValue) {
  await mkdir(path.dirname(databasePath), { recursive: true });
  await writeFile(databasePath, JSON.stringify(databaseValue, null, 2));
}
