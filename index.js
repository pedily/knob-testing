import { getFeedUrls } from "./config.js";
import { initialize, loadfile } from "./player.js";
import { assureAppDataDir, assureDir } from "./utils/cache.js";
import {
  assureEpisode,
  getEpisodeFileName,
  getEpisodeUrl,
  getEpisodesDir,
} from "./utils/episode.js";
import { getFeed } from "./utils/feed.js";

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

  await initialize();
  await loadfile(getEpisodeFileName(getEpisodeUrl(episodes[0])));
})();

// import rpio from "rpio";
// import { KY040 } from "./ky040.js";

// const DATAPIN = 6;
// const SWITCHPIN = 13;
// const CLOCKPIN = 5;

// rpio.init({
//   mapping: "gpio",
//   mock: "raspi-3",
// });

// const knob = new KY040({
//   dataPin: DATAPIN,
//   clockPin: CLOCKPIN,
//   switchPin: SWITCHPIN,
// });

// knob.onButtonPress(console.log.bind(console, "[BUTTON] DOWN"));
// knob.onButtonRelease(console.log.bind(console, "[BUTTON] UP"));
// knob.onKnobTurnLeft(console.log.bind(console, "[KNOB] <<<"));
// knob.onKnobTurnRight(console.log.bind(console, "[KNOB] >>>"));
