import videojs from "video.js";
import { version } from "../package.json";
import { MediacmsVjsPlugin } from "./Plugin";

const defaultState: mediacmsVjsPlugin.State = {
	volume: 1,
	theaterMode: false,
	soundMuted: false,
	ended: false,
	playing: false,
	videoRatio: 0,
	playerRatio: 0,
	isOpenSettingsOptions: false,
	isOpenSubtitlesOptions: false,
	theSelectedQuality: 480,
	theSelectedSubtitleOption: "off",
	theSelectedAutoQuality: 480,
	theSelectedPlaybackSpeed: 1,
	openSettings: false,
	closeSettings: false,
	openSettingsFromKeyboard: false,
	closeSettingsFromKeyboard: false,
	openSubtitles: false,
	openSubtitlesFromKeyboard: false,
	closeSubtitles: false,
	closeSubtitlesFromKeyboard: false,
};

MediacmsVjsPlugin.VERSION = version;
MediacmsVjsPlugin.defaultState = defaultState;

videojs.registerPlugin("mediacmsVjsPlugin", MediacmsVjsPlugin);

export { MediacmsVjsPlugin };
