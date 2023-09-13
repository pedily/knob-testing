import rpio from "rpio";
import { KY040 } from "./ky040.js";
import PlayerController from "media-player-controller";

const DATAPIN = 6;
const SWITCHPIN = 13;
const CLOCKPIN = 5;

rpio.init({
  mapping: "gpio",
//  mock: "raspi-3",
});

const knob = new KY040({
  dataPin: DATAPIN,
  clockPin: CLOCKPIN,
  switchPin: SWITCHPIN,
});

const player = new PlayerController({
  app: 'mpv',
  args: ['--no-video'],
  media: './minkorrekt.mp3'
});

knob.onButtonPress(() => {
  console.log("press");
  player.cyclePause();
});
knob.onButtonRelease(console.log.bind(console, "[BUTTON] UP"));
knob.onKnobTurnLeft(() => {
  console.log("left");
//  player.adjustVolume(-5);
});
knob.onKnobTurnRight(() => {
  console.log("right");
//  player.adjustVolume(5);
});

player.on("playback", console.log.bind(console, "playback"));
player.on("playback-started", console.log.bind(console, "playback-started"));
console.log("ready");



player.launch(err => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('launched!');
});
