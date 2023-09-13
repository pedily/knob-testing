import rpio from "rpio";
import { EventEmitter } from "events";

export class KY040 {
  constructor({ dataPin, switchPin, clockPin }) {
    this._events = new EventEmitter();
    this._knobEventBuffer = [];
    this.pins = { dataPin, switchPin, clockPin };

    this._init();
  }

  _init() {
    rpio.open(this.pins.dataPin, rpio.INPUT, rpio.PULL_UP);
    rpio.open(this.pins.switchPin, rpio.INPUT, rpio.PULL_UP);
    rpio.open(this.pins.clockPin, rpio.INPUT, rpio.PULL_UP);

    rpio.poll(
      this.pins.dataPin,
      this._handleKnobEvent.bind(this, "data"),
      rpio.POLL_LOW
    );
    rpio.poll(
      this.pins.clockPin,
      this._handleKnobEvent.bind(this, "clock"),
      rpio.POLL_LOW
    );

    rpio.poll(
      this.pins.switchPin,
      this._handleSwitchEvent.bind(this),
      rpio.POLL_BOTH
    );
  }

  _handleSwitchEvent() {
    const pinValue = rpio.read(this.pins.switchPin);

    if (pinValue === 0) {
      this._events.emit("buttonpress");
    } else if (pinValue === 1) {
      this._events.emit("buttonrelease");
    }
  }

  _handleKnobEvent(knobEvent) {
    const buf = this._knobEventBuffer;
    buf.push(knobEvent);

    // handle "knob turn right"
    if (buf[0] === "clock" && buf[1] === "clock" && buf[2] === "data") {
      this._events.emit("turnright");
      this._knobEventBuffer = [];
      return;
    }

    // handle "knob turn left"
    if (buf[0] === "data" && buf[1] === "clock" && buf[2] === "data") {
      this._events.emit("turnleft");
      this._knobEventBuffer = [];
      return;
    }

    // drop oldest event if event buffer is full
    if (buf.length >= 3) {
      buf.shift();
    }
  }

  _addHandler(event, handler) {
    this._events.on(event, handler);

    return () => {
      this._events.off(event, handler);
    };
  }

  onButtonPress(handler) {
    return this._addHandler("buttonpress", handler);
  }

  onButtonRelease(handler) {
    return this._addHandler("buttonrelease", handler);
  }

  onKnobTurnRight(handler) {
    return this._addHandler("turnright", handler);
  }

  onKnobTurnLeft(handler) {
    return this._addHandler("turnleft", handler);
  }
}
