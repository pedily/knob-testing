import { join } from "path";
import { createWriteStream, existsSync } from "fs";
import { unlink } from "fs/promises";

import fr from "follow-redirects";

import { getHash } from "./getHash.js";
import { getAppDataDir } from "../config.js";

export function getEpisodesDir() {
  return join(getAppDataDir(), "episodes");
}

export function getEpisodeFileName(episodeUrl) {
  return join(getEpisodesDir(), getHash(episodeUrl));
}

export function getEpisodeUrl(episode) {
  return episode.enclosure.url;
}

async function fetchEpisode(episodeUrl) {
  return new Promise((resolve, reject) => {
    const episodeFileName = getEpisodeFileName(episodeUrl);
    const file = createWriteStream(episodeFileName);

    fr.https.get(episodeUrl, (response) => {
      response.pipe(file);
    });
    file.on("finish", () => {
      file.close();
      resolve();
    });

    file.on("error", async (err) => {
      console.error("cant write episode", err);
      file.close();
      await unlink(episodeFileName);
      reject();
    });
  });
}

export async function assureEpisode(episodeUrl) {
  const episodeFileName = getEpisodeFileName(episodeUrl);

  if (existsSync(episodeFileName)) return;

  try {
    await fetchEpisode(episodeUrl);
  } catch {
    throw new Error("Unable to load episode");
  }
}
