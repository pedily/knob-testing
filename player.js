import Mpv from "mpv";

/**
 * what to use for "playing an audio file"?
 *
 * https://www.npmjs.com/package/media-player-controller
 * https://www.npmjs.com/search?q=keywords:ffplay
 * https://www.npmjs.com/package/mpv
 *
 * media-player-controller controlling mpv sounds awesome!
 */

let mpv;

export async function initialize() {
  mpv = await Mpv({
    args: ["--no-video", "--no-terminal"],
  });
}

export async function loadfile(fileName) {
  return await mpv.command("loadfile", fileName);
}
