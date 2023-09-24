import { mkdir } from "fs/promises";
import { existsSync } from "fs";

import { getAppDataDir } from "../config.js";

export async function assureDir(path) {
  if (existsSync(path)) return;

  return await mkdir(path);
}

export async function assureAppDataDir() {
  return await assureDir(getAppDataDir());
}
