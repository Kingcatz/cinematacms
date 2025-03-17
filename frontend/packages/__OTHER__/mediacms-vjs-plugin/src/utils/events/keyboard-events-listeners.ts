import videojs from "video.js";

export const keyboardEvents = (player: videojs.Player) => {
	const decreaseVolume = () => {
		// console.log( 'DECREASE VOLUME' );
		player.volume(Math.max(0, player.volume() - 0.05));
	};

	const increaseVolume = () => {
		// console.log( 'INCREASE VOLUME' );
		if (player.muted()) {
			player.muted(false);
		} else {
			player.volume(Math.min(1, player.volume() + 0.05));
		}
	};

	const moveBackward = () => {
		// console.log( 'MOVE BACKWARD' );
		player.currentTime(player.currentTime() - 5 * player.playbackRate());
		player.trigger("movebackward");
	};

	const moveForward = () => {
		// console.log( 'MOVE FORWARD' );
		player.currentTime(player.currentTime() + 5 * player.playbackRate());
		player.trigger("moveforward");
	};

	const playNext = () => {
		// console.log("TRIGGER PLAY NEXT");
		player.trigger("clicknext");
	};

	const playPrevious = () => {
		// console.log("TRIGGER PLAY PREVIOUS");
		player.trigger("clickprevious");
	};

	const toggleFullscreenMode = () => {
		if (player.isFullscreen()) {
			// console.log( 'EXIT FULLSCREEN MODE' );
			player.exitFullscreen();
		} else {
			// console.log( 'ENTER FULLSCREEN MODE' );
			player.requestFullscreen();
		}
	};

	const togglePlay = () => {
		if (player.paused()) {
			// console.log( 'PLAY' );
			player.play();
		} else {
			// console.log( 'PAUSE' );
			player.pause();
		}
	};

	const toggleSoundMute = () => {
		// console.log( 'TOGGLE SOUND MUTE' );
		player.muted(!player.muted());
	};

	const toggleTheaterMode = () => {
		// console.log( 'TOGGLE THEATER MODE' );
		if (player.isFullscreen()) {
			player.exitFullscreen();
		}
		player.trigger("theatermodechange");
	};

	const onkeyup = (e: KeyboardEvent) => {
		if (player.ended()) {
			return;
		}

		if (e.shiftKey && -1 < ["KeyN", "KeyP"].indexOf(e.code)) {
			if ("KeyN" === e.code) {
				playNext();
			} else if ("KeyP" === e.code) {
				playPrevious();
			}
			e.preventDefault();
			e.stopPropagation();
		} else if (-1 < ["KeyK", "KeyF", "KeyM", "KeyT"].indexOf(e.code)) {
			if ("KeyK" === e.code) {
				togglePlay();
			} else if ("KeyF" === e.code) {
				toggleFullscreenMode();
			} else if ("KeyM" === e.code) {
				toggleSoundMute();
			} else if ("KeyT" === e.code) {
				toggleTheaterMode();
			}
			e.preventDefault();
			e.stopPropagation();
		} else if (!Number.isNaN(e.key)) {
			const num = Math.max(0, Math.min(9, parseInt(e.key, 10)));
			if (e.key === num.toString()) {
				player.currentTime((num * player.duration()) / 10);
				e.preventDefault();
				e.stopPropagation();
			}
		}
	};

	const onkeydown = (e: KeyboardEvent) => {
		if (player.ended()) {
			return;
		}

		if (
			-1 <
			["Space", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].indexOf(e.code)
		) {
			if ("Space" === e.code) {
				togglePlay();
			} else if ("ArrowRight" === e.code) {
				moveForward();
			} else if ("ArrowLeft" === e.code) {
				moveBackward();
			} else if ("ArrowUp" === e.code) {
				increaseVolume();
			} else if ("ArrowDown" === e.code) {
				decreaseVolume();
			}

			e.preventDefault();
			e.stopPropagation();
		}
	};

	const playerHTMLElement = <HTMLElement>player.el();

	playerHTMLElement.onkeyup = onkeyup;
	playerHTMLElement.onkeydown = onkeydown;
};
