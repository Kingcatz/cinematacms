import videojs from "video.js";

export const eventsAnimations = (player: videojs.Player) => {
	let previousEventType = "";
	let animSetTimeout: NodeJS.Timeout | undefined;
	let animResetTimeout: NodeJS.Timeout | undefined;

	const animElement = player.el().querySelector(".vjs-actions-anim");

	const eventsListener = (eventType: string) => {
		if (!player.hasStarted() || !animElement) {
			return;
		}

		let classname = "";

		if (
			-1 <
			[
				"playing",
				"pause",
				"moveforward",
				"movebackward",
				"clicknext",
				"clickprevious",
				"volumechange",
			].indexOf(eventType)
		) {
			if ("playing" === eventType) {
				classname = "pause" === previousEventType ? "started-playing" : "";
			} else if ("pause" === eventType) {
				classname = "just-paused";
			} else if ("moveforward" === eventType) {
				classname = "moving-forward";
			} else if ("movebackward" === eventType) {
				classname = "moving-backward";
			} else if ("clicknext" === eventType) {
				classname = "play_next";
			} else if ("clickprevious" === eventType) {
				classname = "play_previous";
			} else if ("volumechange" === eventType) {
				const volume = player.volume();
				classname =
					player.muted() || 0.001 >= volume
						? "volume-mute"
						: 0.33 >= volume
						? "volume-low"
						: 0.69 >= volume
						? "volume-mid"
						: "volume-high";
			}
		}

		previousEventType = eventType;

		if (!classname) {
			return;
		}

		if (animSetTimeout) {
			clearTimeout(animSetTimeout);
		}

		if (animResetTimeout) {
			clearTimeout(animResetTimeout);
		}

		animElement.setAttribute("class", "vjs-actions-anim");

		animSetTimeout = setTimeout(() => {
			animElement.setAttribute(
				"class",
				`vjs-actions-anim active-anim ${classname}`
			);

			animResetTimeout = setTimeout(() => {
				animElement.setAttribute("class", "vjs-actions-anim");
			}, 650);
		}, 100);
	};

	return eventsListener;
};
