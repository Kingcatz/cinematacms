import videojs from "video.js";

import "mediacms-vjs-plugin/dist/mediacms-vjs-plugin.js";
import "mediacms-vjs-plugin/dist/mediacms-vjs-plugin.css";

const isString = (v: any) => "string" === typeof v || v instanceof String;
const isArray = (v: any) =>
	!Array.isArray
		? "[object Array]" === Object.prototype.toString.call(v)
		: Array.isArray(v);
const isBoolean = (v: any) => "boolean" === typeof v || v instanceof Boolean;
const ifBooleanElse = (bol: any, els: any) => (isBoolean(bol) ? bol : els);
const isInteger = (v: any) => !isNaN(v) && v === parseInt(v, 10);
const isPositiveInteger = (v: any) => isInteger(v) && 0 < v;

const configPluginOptionsDefault: ISettings = {
	liveui: false,
	keyboardControls: true,
	nativeDimensions: false,
	suppressNotSupportedError: true,
	preload: "auto",
	enabledTouchControls: true,
	sources: [],
	poster: "",
	loop: false,
	controls: true,
	autoplay: false,
	bigPlayButton: true,
	controlBar: {
		children: [],
		bottomBackground: true,
		progress: true,
		play: true,
		next: false,
		previous: false,
		volume: true,
		pictureInPicture: true,
		fullscreen: true,
		theaterMode: true,
		time: true,
	},
	subtitles: {
		on: false,
		languages: [],
		default: null,
	},
	cornerLayers: {
		topLeft: null,
		topRight: null,
		bottomLeft: null,
		bottomRight: null,
	},
	videoPreviewThumb: {
		url: "",
		frame: {
			width: 160,
			height: 90,
			seconds: 10,
		},
	},
};

const configPluginStatesDefault: IState = {
	volume: 1,
	soundMuted: false,
	theaterMode: false,
	theSelectedQuality: null,
	theSelectedPlaybackSpeed: 1,
	theSelectedSubtitleOption: null,
};

function formatVideoResolutions(resolutions?: {
	[key: string]: IVideoResolution;
}) {
	const ret: {
		[key: string]: { title: string; src: string[]; format: VideoFormat[] };
	} = {};

	if (undefined !== resolutions) {
		let res: string;
		let vidRes: IVideoResolution | undefined;

		for (res in resolutions) {
			vidRes = resolutions[res];

			if (undefined !== vidRes) {
				ret[res] = {
					title: res,
					src: vidRes.url, // TODO: Validate sources.
					format: vidRes.format, // TODO: Validate formats.
				};
			}
		}
	}

	return ret;
}

function formatPlaybackSpeeds(playbackSpeeds: VideoPlaybackSpeed[]) {
	return playbackSpeeds.map((ps) => {
		return {
			title: 1 === ps ? "Normal" : ps.toString(),
			speed: ps,
		};
	});
}

function formatOptionsControlBar(controlBar: ISettingsControlBar) {
	let ret: ISettingsControlBar = { ...configPluginOptionsDefault.controlBar };
	let k: keyof ISettingsControlBar;
	for (k in configPluginOptionsDefault.controlBar) {
		ret[k] = ifBooleanElse(
			controlBar[k],
			configPluginOptionsDefault.controlBar[k]
		);
	}
	return ret;
}

function formatOptionsSubtitles(inp?: ISettingsSubtitles): ISettingsSubtitles {
	const ret: ISettingsSubtitles = { ...configPluginOptionsDefault.subtitles };
	if (undefined !== inp) {
		ret.on = ifBooleanElse(inp.on, configPluginOptionsDefault.subtitles.on);
		if (undefined !== inp.default) {
			ret.default = inp.default;
		}
		ret.languages = isArray(inp.languages)
			? inp.languages
			: configPluginOptionsDefault.subtitles.languages;
	}
	return ret;
}

function formatCornerLayers(cornerLayers: ISettingsCornersLayers) {
	const ret: ISettingsCornersLayers = {
		...configPluginOptionsDefault.cornerLayers,
	};
	let k: keyof ISettingsCornersLayers;
	for (k in configPluginOptionsDefault.cornerLayers) {
		ret[k] =
			undefined === typeof cornerLayers[k] || !cornerLayers[k]
				? configPluginOptionsDefault.cornerLayers[k]
				: cornerLayers[k];
	}
	return ret;
}

function formatVideoPreviewThumb(videoPreviewThumb?: IVideoPreviewThumb) {
	const ret: IVideoPreviewThumb = {
		...configPluginOptionsDefault.videoPreviewThumb,
	};

	if (undefined !== videoPreviewThumb) {
		if (undefined !== videoPreviewThumb.url) {
			ret.url = videoPreviewThumb.url;
		}

		if (undefined !== videoPreviewThumb.frame) {
			if (isPositiveInteger(videoPreviewThumb.frame.width)) {
				ret.frame.width = videoPreviewThumb.frame.width;
			}

			if (isPositiveInteger(videoPreviewThumb.frame.height)) {
				ret.frame.height = videoPreviewThumb.frame.height;
			}

			if (isPositiveInteger(videoPreviewThumb.frame.seconds)) {
				ret.frame.seconds = videoPreviewThumb.frame.seconds;
			}
		}
	}

	return ret;
}

function formatOptions(options: ISettings): ISettings {
	return {
		enabledTouchControls: ifBooleanElse(
			options.enabledTouchControls,
			configPluginOptionsDefault.enabledTouchControls
		),
		sources:
			isArray(options.sources) && options.sources.length ? options.sources : [],
		poster:
			isString(options.poster) && "" !== options.poster.trim()
				? options.poster
				: configPluginOptionsDefault.poster,
		loop: ifBooleanElse(options.loop, configPluginOptionsDefault.loop),
		controls: ifBooleanElse(
			options.controls,
			configPluginOptionsDefault.controls
		),
		autoplay:
			"any" === options.autoplay ||
			"play" === options.autoplay ||
			"muted" === options.autoplay
				? options.autoplay
				: ifBooleanElse(options.autoplay, configPluginOptionsDefault.autoplay),
		bigPlayButton: ifBooleanElse(
			options.bigPlayButton,
			configPluginOptionsDefault.bigPlayButton
		),
		controlBar: formatOptionsControlBar(options.controlBar),
		subtitles: formatOptionsSubtitles(options.subtitles),
		cornerLayers: formatCornerLayers(options.cornerLayers),
		videoPreviewThumb: formatVideoPreviewThumb(options.videoPreviewThumb),
	};
}

function formatState(pluginState: IState, subtitle: string | null) {
	const state = { ...configPluginStatesDefault, ...pluginState };
	if (subtitle) {
		state.theSelectedSubtitleOption = subtitle;
	}
	return state;
}

export function MediacmsPlayer(
	domPlayer: HTMLVideoElement | HTMLAudioElement | null | undefined,
	pluginOptions: ISettings,
	pluginState: IState,
	videoResolutions: { [key: string]: IVideoResolution } = {},
	videoPlaybackSpeed: VideoPlaybackSpeed[] = [],
	stateUpdateCallback?: () => void,
	nextButtonClickCallback?: () => void,
	previousButtonClickCallback?: () => void
) {
	// console.log( videojs );
	// console.log( videojs.getPlugins() );
	// return;

	if (null === domPlayer || undefined === domPlayer) {
		console.error("Invalid player DOM element", domPlayer); // TODO: Validate element's type (<video> or <audio>)...?
		return;
	}

	const resolutions: mediacmsVjsPlugin.InputResolutions =
		formatVideoResolutions(videoResolutions);
	const playbackSpeeds: mediacmsVjsPlugin.InputPlaybackSpeed[] =
		formatPlaybackSpeeds(videoPlaybackSpeed);
	const options /*: mediacmsVjsPlugin.InputOptions*/ =
		formatOptions(pluginOptions);
	const state: Partial<mediacmsVjsPlugin.InputState> = formatState(
		pluginState,
		options.subtitles.default
	);

	const player = videojs(domPlayer, options);

	player.mediacmsVjsPlugin(
		domPlayer,
		options,
		state,
		resolutions,
		playbackSpeeds,
		stateUpdateCallback,
		nextButtonClickCallback,
		previousButtonClickCallback
	);

	return {
		player,
		// isEnded: () => player.mediacmsVjsPlugin().isEnded,
		// isFullscreen: () => player.mediacmsVjsPlugin().isFullscreen,
		// isTheaterMode: () => player.mediacmsVjsPlugin().isTheaterMode,
	};
}
