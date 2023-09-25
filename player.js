import MPV from "node-mpv-2";

/**
 * what to use for "playing an audio file"?
 *
 * https://www.npmjs.com/package/media-player-controller
 * https://www.npmjs.com/search?q=keywords:ffplay
 * https://www.npmjs.com/package/mpv
 *
 * media-player-controller controlling mpv sounds awesome!
 */

const mpv = new MPV({
  audio_only: true,
});

export async function initialize() {
  return await mpv.start();
}

export async function addFile(fileName) {
  return await mpv.load(fileName, "append");
}

export async function togglePause() {
  return await mpv.togglePause();
}

export async function increaseVolume() {
  return await mpv.adjustVolume(1);
}

export async function decreaseVolume() {
  return await mpv.adjustVolume(-1);
}

export async function play() {
  return await mpv.play();
}
