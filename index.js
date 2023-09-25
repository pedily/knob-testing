import { getFeedUrls } from "./config.js";
import { addFile, initialize, play } from "./player.js";
import { assureAppDataDir, assureDir } from "./utils/cache.js";
import {
  assureEpisode,
  getEpisodeFileName,
  getEpisodeUrl,
  getEpisodesDir,
} from "./utils/episode.js";
import { getFeed } from "./utils/feed.js";
import { setup } from "./utils/gpio.js";

(async () => {
  await assureAppDataDir();
  await assureDir(getEpisodesDir());

  const feedUrls = await getFeedUrls();
  const feeds = [];

  for (const feedUrl of feedUrls) {
    const feed = await getFeed(feedUrl);
    feeds.push(feed);
  }

  const episodes = feeds.reduce((episodes, feed) => {
    episodes.push(...feed.episodes);

    return episodes;
  }, []);

  episodes.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  for (const episode of episodes) {
    const episodeUrl = getEpisodeUrl(episode);

    try {
      console.log(`downloading episode: ${episode.title}`);
      await assureEpisode(episodeUrl);
    } catch {
      console.log("FAILED TO FETCH EPISODE");
    }
  }

  console.log("initializing player...");
  await initialize();

  for (const episode of episodes) {
    await addFile(getEpisodeFileName(getEpisodeUrl(episode)));
  }

  console.log("binding keys...");
  setup();

  console.log("playing episode...");
  await play();
})();
