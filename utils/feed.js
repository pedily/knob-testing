import { join } from "path";
import { readFile, writeFile } from "fs/promises";

import podcastXmlParser from "podcast-xml-parser";

import { getHash } from "./getHash.js";
import { getAppDataDir } from "../config.js";
import { assureDir } from "./cache.js";

async function fetchFeed(feedUrl) {
  return await podcastXmlParser(new URL(feedUrl), {
    limit: 1,
  });
}

function getFeedsDir() {
  return join(getAppDataDir(), "feeds");
}

async function assureFeedsDir() {
  return await assureDir(getFeedsDir());
}

function getFeedFileName(feedUrl) {
  return join(getFeedsDir(feedUrl), getHash(feedUrl));
}

async function getCachedFeed(feedUrl) {
  return JSON.parse(await readFile(getFeedFileName(feedUrl)));
}

export async function getFeed(feedUrl) {
  await assureFeedsDir();

  const fetchedFeed = await (async () => {
    try {
      const feed = await fetchFeed(feedUrl);
      const feedFileName = getFeedFileName(feedUrl);
      console.log(feedFileName);
      await writeFile(feedFileName, JSON.stringify(feed, null, 2));
      return feed;
    } catch (error) {
      console.warn(`Could not fetch feed for '${feedUrl}'`);
    }
  })();

  if (fetchedFeed) return fetchedFeed;

  // offline
  if (!fetchedFeed) {
    try {
      return await getCachedFeed(feedUrl);
    } catch {
      throw new Error(`Could not read cached feed for '${feedUrl}'`);
    }
  }
}
