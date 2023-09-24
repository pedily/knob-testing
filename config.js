import { readFile } from "fs/promises";
import { appData } from "./appdata.js";

let config;
export const APP_NAME = "picast";

export async function getConfig() {
  if (!config) {
    const _config = JSON.parse(await readFile("config.json", "utf-8"));
    config = _config;
  }

  return config;
}

export function getAppDataDir() {
  return appData(APP_NAME);
}

export async function getFeedUrls() {
  return (await getConfig()).feeds;
}
