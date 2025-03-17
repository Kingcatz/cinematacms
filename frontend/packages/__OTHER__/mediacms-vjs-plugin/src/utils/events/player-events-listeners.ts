import videojs from "video.js";

export function playerEvents(
	player: videojs.Player,
	eventListeners: ((type: string, args?: { [key: string]: any }) => void)[]
) {
	const eventListener = (type: string, args?: { [key: string]: any }) => {
		eventListeners.forEach((fn) => fn(type, args));
	};

	const eventHandler = (ev: Event) => {
		// console.log("=>", ev.type);
		eventListener(ev.type);
	};

	/* -------- Player events -------- */

	player.on("playing", eventHandler);
	player.on("pause", eventHandler);
	player.on("ended", eventHandler);
	player.on("error", eventHandler);
	player.on("dispose", eventHandler);
	player.on("userinactive", eventHandler);

	/* ----- Progress bar events ----- */

	player.on("seeked", eventHandler);
	player.on("seeking", eventHandler);
	player.on("waiting", eventHandler);
	player.on("timeupdate", eventHandler);
	player.on("fullscreenchange", eventHandler);

	/* ----- Volume handler(s) events ----- */

	player.on("volumechange", eventHandler);

	/* ----- Custom events ----- */

	player.on("moveforward", eventHandler);
	player.on("movebackward", eventHandler);
	player.on("theatermodechange", eventHandler);
	player.on("clicknext", eventHandler);
	player.on("clickprevious", eventHandler);

	/* ----- Settings panes events ----- */

	function subtitlesPaneChange(ev: Event, keyboardTrigger = false) {
		// console.log( 'TOGGLE SUBTITLES MANE PANE VISIBILITY' );
		// console.log(ev);
		eventListener(ev.type, { keyboardTrigger });
	}

	function settingsMainPaneChange(ev: Event, keyboardTrigger = false) {
		// console.log( 'TOGGLE SETTINGS MANE PANE VISIBILITY' );
		// console.log(ev);
		eventListener(ev.type, { keyboardTrigger });
	}

	function playbackRateChange(ev: Event, value: string) {
		eventListener(ev.type, { value });
	}

	function qualityChange(ev: Event, value: string) {
		eventListener(ev.type, { value });
	}

	function subtitleChange(ev: Event, value: string) {
		eventListener(ev.type, { value });
	}

	player.on("subtitlesPaneChange", subtitlesPaneChange);
	player.on("settingsMainPaneChange", settingsMainPaneChange);

	player.on("playbackRateChange", playbackRateChange);
	player.on("qualityChange", qualityChange);
	player.on("subtitleChange", subtitleChange);
}
