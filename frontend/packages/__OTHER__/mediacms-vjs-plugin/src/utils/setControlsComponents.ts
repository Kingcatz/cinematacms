import videojs from "video.js";

import {
	TouchControlsContainer,
	PlayTouchButtonContainer,
	NextTouchButtonContainer,
	PreviousTouchButtonContainer,
	ControlBarLeftSide,
	ControlBarRightSide,
	ControlBarBackground,
	SettingsPanel,
	SubtitlesPanel,
	PreviewThumb,
} from "../components";

function composeSettingsPanes(
	player: videojs.Player,
	playbackRates?: {
		default: number;
		options: mediacmsVjsPlugin.InputPlaybackSpeed[];
	},
	qualities?: { default: string; options: mediacmsVjsPlugin.InputResolutions }
) {
	const settings = [];

	if (playbackRates) {
		const speedValues = playbackRates.options.map((ps) => {
			return { value: ps.speed.toString(), title: ps.title };
		});

		settings.push({
			id: "playback-speed",
			label: "Playback speed",
			values: speedValues,
			selected: playbackRates.default.toString() || speedValues[0].value,
			paneClassname: "vjs-playback-speed-panel",
			optionClassname: "vjs-selected-speed",
			onSelectTriggerEvent: "playbackRateChange",
		});
	}

	if (qualities) {
		const qualityValues = Object.keys(qualities.options).map((key) => {
			return { value: key, title: qualities.options[key].title };
		});

		settings.push({
			id: "quality",
			label: "Quality",
			values: qualityValues,
			selected: qualities.default || qualityValues[0].value,
			paneClassname: "vjs-resolutions-panel",
			optionClassname: "vjs-selected-quality",
			onSelectTriggerEvent: "qualityChange",
		});
	}

	new SettingsPanel(player, {
		settings: settings.map((item) => {
			return {
				id: item.id,
				title: item.label,
				values: item.values,
				selected: item.selected,
				paneClassname: item.paneClassname,
				optionClassname: item.optionClassname,
				onSelectTriggerEvent: item.onSelectTriggerEvent,
			};
		}),
	});
}

function composeSubtitlesPane(
	player: videojs.Player,
	subtitlesOptions: mediacmsVjsPlugin.ISettingsSubtitles
) {
	const subtitleValues = subtitlesOptions.languages.map((lang) => {
		return { value: lang.srclang, title: lang.label };
	});
	const subtitleDefault: string =
		subtitlesOptions.default || subtitleValues[0].value;

	new SubtitlesPanel(player, {
		settings: [
			{
				title: "<span>Subtitles</span>",
				values: subtitleValues,
				selected: subtitleDefault,
			},
		],
	});
}

function setControlBarComponents(
	player: videojs.Player,
	state: mediacmsVjsPlugin.State,
	options: mediacmsVjsPlugin.InputOptions
) {
	if (!options.controlBar) {
		return;
	}

	const controlBarOptions = options.controlBar;

	const enabledControls = {
		leftSide:
			controlBarOptions.play ||
			controlBarOptions.previous ||
			controlBarOptions.next ||
			controlBarOptions.volume ||
			controlBarOptions.time
				? true
				: false,
		rightSide:
			controlBarOptions.theaterMode ||
			controlBarOptions.fullscreen ||
			controlBarOptions.pictureInPicture
				? true
				: false,
		settingsPanel: false,
		resolutions:
			options.resolutions &&
			options.resolutions.options &&
			Object.keys(options.resolutions.options).length,
		playbackSpeed:
			options.playbackSpeeds &&
			options.playbackSpeeds.options &&
			options.playbackSpeeds.options.length,
		subtitles:
			options.subtitles &&
			options.subtitles.languages &&
			options.subtitles.languages.length,
	};

	enabledControls.settingsPanel =
		enabledControls.resolutions || enabledControls.playbackSpeed ? true : false;
	enabledControls.rightSide =
		enabledControls.rightSide ||
		enabledControls.settingsPanel ||
		enabledControls.subtitles
			? true
			: false;

	const controlBar = player.getChild("controlBar");

	if (undefined !== controlBar) {
		if (controlBarOptions.bottomBackground) {
			controlBar.addChild(new ControlBarBackground(player));
		}

		if (controlBarOptions.progress) {
			const progressControl = controlBar.addChild("progressControl");

			if (options.videoPreviewThumb && options.videoPreviewThumb.url) {
				const seekBar = progressControl.getChild("SeekBar");
				if (seekBar) {
					const mouseTimeDisplay = seekBar.getChild("MouseTimeDisplay");
					if (mouseTimeDisplay) {
						seekBar.removeChild(mouseTimeDisplay);
					}
				}

				videojs.registerComponent("PreviewThumb", PreviewThumb);

				controlBar.addChild("previewThumb", { ...options.videoPreviewThumb });
			}
		}

		if (enabledControls.subtitles && options.subtitles) {
			composeSubtitlesPane(player, options.subtitles);
		}

		if (enabledControls.settingsPanel) {
			composeSettingsPanes(
				player,
				enabledControls.playbackSpeed ? options.playbackSpeeds : undefined,
				enabledControls.resolutions ? options.resolutions : undefined
			);
		}

		if (enabledControls.leftSide) {
			const controlBarLeftSideOptions = {
				hidePlay: !controlBarOptions.play,
				hidePrevious: !controlBarOptions.previous,
				hideNext: !controlBarOptions.next,
				hideVolume: !controlBarOptions.volume,
				hideTime: !controlBarOptions.time,
			};

			controlBar.addChild(
				new ControlBarLeftSide(player, controlBarLeftSideOptions)
			);
		}

		if (enabledControls.rightSide) {
			const controlBarRightSideOptions = {
				hideSubtitles: !enabledControls.subtitles,
				hideSettings: !(
					enabledControls.resolutions || enabledControls.playbackSpeed
				),
				hideTheaterMode: controlBarOptions
					? !controlBarOptions.theaterMode
					: undefined,
				theaterModeState: state.theaterMode,
				hidePictureInPicture: controlBarOptions
					? !controlBarOptions.pictureInPicture ||
					  !("exitPictureInPicture" in document)
					: undefined,
				hideFullscreen: controlBarOptions
					? !controlBarOptions.fullscreen
					: undefined,
			};

			controlBar.addChild(
				new ControlBarRightSide(player, controlBarRightSideOptions)
			);
		}
	}
}

function setTouchControlsContainers(
	player: videojs.Player,
	controlBarOptions: mediacmsVjsPlugin.InputOptionsControlBar
) {
	const touchControls = new TouchControlsContainer(player);
	// const disableNextBtn = ! controlBarOptions.next;
	// const disablePreviousBtn = ! controlBarOptions.previous;
	const disableNextBtn = false;
	const disablePreviousBtn = false;
	touchControls.addChild(
		new PreviousTouchButtonContainer(player, {
			isDisabled: disablePreviousBtn,
			isHidden: disablePreviousBtn && disableNextBtn,
		})
	);
	touchControls.addChild(new PlayTouchButtonContainer(player));
	touchControls.addChild(
		new NextTouchButtonContainer(player, {
			isDisabled: disableNextBtn,
			isHidden: disablePreviousBtn && disableNextBtn,
		})
	);
}

export function setControlsComponents(
	player: videojs.Player,
	state: mediacmsVjsPlugin.State,
	options: mediacmsVjsPlugin.InputOptions
) {
	if (options.controlBar) {
		if (options.enabledTouchControls) {
			setTouchControlsContainers(player, options.controlBar);
		}

		setControlBarComponents(player, state, options);
	}
}
