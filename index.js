import rpio from 'rpio';

const DATAPIN = 6;
const SWITCHPIN = 13;
const CLOCKPIN = 5;

rpio.init({
	mapping: 'gpio'
});

rpio.open(DATAPIN, rpio.INPUT, rpio.PULL_UP);
rpio.open(SWITCHPIN, rpio.INPUT, rpio.PULL_UP);
rpio.open(CLOCKPIN, rpio.INPUT, rpio.PULL_UP);

let EVENTBUFFER = [];

const handleEvent = (event) => {
	while (EVENTBUFFER.length > 2) {
		EVENTBUFFER.shift();
	}
	EVENTBUFFER.push(event);

	if (EVENTBUFFER[0] === "clock" && EVENTBUFFER[1] === "clock" && EVENTBUFFER[2] === "data") {
		console.log("[KNOB] >>>");
		EVENTBUFFER = [];
	}
	if (EVENTBUFFER[0] === "data" && EVENTBUFFER[1] === "clock" && EVENTBUFFER[2] === "data") {
		console.log("[KNOB] <<<");
		EVENTBUFFER = [];
	}
}

rpio.poll(DATAPIN, handleEvent.bind(null, "data"), rpio.POLL_LOW);

rpio.poll(CLOCKPIN, handleEvent.bind(null, "clock"), rpio.POLL_LOW);

rpio.poll(SWITCHPIN, () => {
	const switchPinValue = rpio.read(SWITCHPIN);
	switch (switchPinValue) {
		case 1: {
			console.log("[BUTTON] UP");
			break;
		}
		case 0: {
			console.log("[BUTTON] DOWN");
			break;
		}
	}
}, rpio.POLL_BOTH);

// clock clock data => right
// data clock data => left
