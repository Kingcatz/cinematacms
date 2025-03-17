import videojs from "video.js";
import "mediacms-vjs-icons/dist/mediacms-vjs-icons.css";
import "./styles/index.scss";

import { eventsAnimations, keyboardEvents, playerEvents } from "./utils/events";

import {
	browserSupports,
	filterInputOptions,
	filterInputState,
	filterVideoResolutions,
	filterPlaybackSpeeds,
	initialResolutionFilter,
	applyCssTransform,
	centralizeBoxPosition,
	controlElementsFocus,
} from "./utils/functions";

import { setComponents } from "./utils/setComponents";
import { setSubtitles } from "./utils/setSubtitles";

const VideoJsPlugin = videojs.getPlugin("plugin");

interface StateChangedEvent extends Event {
	changes: any;
}

interface MediacmsVjsPlugin extends videojs.Plugin {}

class MediacmsVjsPlugin extends VideoJsPlugin implements MediacmsVjsPlugin {
	static VERSION: string;
	static defaultState: mediacmsVjsPlugin.State;

	state: any;
	setState: any;

	csstransforms: boolean;

	options: mediacmsVjsPlugin.InputOptions | undefined;

	domElem?: HTMLVideoElement | HTMLAudioElement;
	progressBarElem?: HTMLElement | null;
	playbackSpeeds?: mediacmsVjsPlugin.InputPlaybackSpeed[];
	videoResolutions?: mediacmsVjsPlugin.InputResolutions;
	videoNativeDimensions?: boolean;

	fullscreenTimeout?: NodeJS.Timeout;

	isChangingResolution?: boolean;
	wasPlayingOnResolutionChange?: boolean;
	hadStartedOnResolutionChange?: boolean;

	stateUpdateCallback?: ((publicState: Object) => void) | null;
	nextButtonClickCallback?: (() => void) | null;
	previousButtonClickCallback?: (() => void) | null;
	initedBandwidthUpdateCallback: boolean;
	initedHlsRetryPlaylistCallback: boolean;

	// showBuffering: boolean;

	buffered: { [key: number]: any };

	constructor(
		player: videojs.Player,
		domElem: HTMLVideoElement | HTMLAudioElement,
		options?: mediacmsVjsPlugin.InputOptions,
		state?: Partial<mediacmsVjsPlugin.InputState>,
		resolutions?: mediacmsVjsPlugin.InputResolutions,
		playbackSpeeds?: mediacmsVjsPlugin.InputPlaybackSpeed[],
		stateUpdateCallback?: () => void,
		nextButtonClickCallback?: () => void,
		previousButtonClickCallback?: () => void
	) {
		const filteredOptions = filterInputOptions(options);

		super(player, filteredOptions);

		this.buffered = {};

		this.csstransforms = browserSupports("csstransforms") || false;

		this.initedBandwidthUpdateCallback = false;
		this.initedHlsRetryPlaylistCallback = false;

		// this.showBuffering = false;

		this.options = filteredOptions;

		if (this.player.options_.sources && !this.player.options_.sources.length) {
			console.warn("Missing media source");
			return;
		}

		this.domElem = domElem;
		this.playbackSpeeds = filterPlaybackSpeeds(playbackSpeeds);
		this.videoResolutions = filterVideoResolutions(resolutions);

		this.videoNativeDimensions =
			undefined !== this.options.nativeDimensions
				? this.options.nativeDimensions
				: false;

		this.isChangingResolution = false;
		this.wasPlayingOnResolutionChange = false;
		this.hadStartedOnResolutionChange = false;

		this.stateUpdateCallback =
			"function" === typeof stateUpdateCallback ? stateUpdateCallback : null;

		this.nextButtonClickCallback =
			"function" === typeof nextButtonClickCallback
				? nextButtonClickCallback
				: null;

		this.previousButtonClickCallback =
			"function" === typeof previousButtonClickCallback
				? previousButtonClickCallback
				: null;

		const prepareState = { ...this.state, ...filterInputState(state) };

		const { initialResolution, resolutionOrder, resolutionFormat } =
			initialResolutionFilter(
				player.src(),
				prepareState.theSelectedQuality,
				this.videoResolutions
			);

		prepareState.theSelectedQuality = initialResolution;

		this.options.resolutions = {
			default: initialResolution,
			options: this.videoResolutions,
		};
		this.options.playbackSpeeds = {
			default: prepareState.theSelectedPlaybackSpeed,
			options: this.playbackSpeeds,
		};
		this.options.enabledTouchControls =
			videojs.browser.TOUCH_ENABLED || this.options.enabledTouchControls;

		this.setState(prepareState);

		setComponents(player, this.state, this.options);

		// console.log( options );
		// console.log( this.state );

		/* ---------------------------------------------------------------------------------------------------- */

		player.addClass("vjs-mediacms-plugin");
		player.addClass("vjs-loading-video");

		if (this.videoNativeDimensions) {
			player.addClass("vjs-native-dimensions");
		}

		if (filteredOptions.enabledTouchControls) {
			player.addClass("vjs-enabled-touch-controls");
		}

		if (this.state.theaterMode) {
			this.player.addClass("vjs-theater-mode");
		}

		player.volume(this.state.volume);
		player.muted(this.state.soundMuted);
		player.playbackRate(this.state.theSelectedPlaybackSpeed);

		this.loadedData = this.loadedData.bind(this);
		this.playerReady = this.playerReady.bind(this);
		this.eventsListener = this.eventsListener.bind(this);
		this.windowResize = this.windowResize.bind(this);

		this.onBandwidthUpdateCallback = this.onBandwidthUpdateCallback.bind(this);
		this.onHlsRetryPlaylistCallback = this.onHlsRetryPlaylistCallback.bind(this);

		this.refreshProgressBar = this.refreshProgressBar.bind(this);

		this.showMainSettingsPane = this.showMainSettingsPane.bind(this);
		this.hideMainSettingsPane = this.hideMainSettingsPane.bind(this);
		this.showSubtitlesPane = this.showSubtitlesPane.bind(this);
		this.hideSubtitlesPane = this.hideSubtitlesPane.bind(this);

		domElem.onloadeddata = this.loadedData;

		player.ready(this.playerReady);

		controlElementsFocus(player);
	}

	showMainSettingsPane(fromKeyboard: boolean) {
		this.setState({
			openSettings: new Date(),
			openSettingsFromKeyboard: fromKeyboard ? new Date() : false,
			isOpenSettingsOptions: true,
			isOpenSubtitlesOptions: false,
		});

		this.player.trigger("hideSubtitlesPane");

		this.player.trigger("showMainSettingsPane", {
			keyboardTrigger: fromKeyboard,
		});
	}

	hideMainSettingsPane(fromKeyboard: boolean) {
		this.setState({
			closeSettings: new Date(),
			closeSettingsFromKeyboard: fromKeyboard ? new Date() : false,
			isOpenSettingsOptions: false,
		});

		this.player.trigger("hideMainSettingsPane");
	}

	showSubtitlesPane(fromKeyboard: boolean) {
		this.setState({
			openSubtitles: new Date(),
			openSubtitlesFromKeyboard: fromKeyboard ? new Date() : false,
			isOpenSubtitlesOptions: true,
			isOpenSettingsOptions: false,
		});

		this.player.trigger("hideMainSettingsPane");

		this.player.trigger("showSubtitlesPane", {
			keyboardTrigger: fromKeyboard,
		});
	}

	hideSubtitlesPane(fromKeyboard: boolean) {
		this.setState({
			closeSubtitles: new Date(),
			closeSubtitlesFromKeyboard: fromKeyboard ? new Date() : false,
			isOpenSubtitlesOptions: false,
		});

		this.player.trigger("hideSubtitlesPane");
	}

	playerReady() {
		// console.log('PLAYER READY');

		keyboardEvents(this.player);
		playerEvents(this.player, [
			this.eventsListener,
			eventsAnimations(this.player),
		]);
		window.addEventListener("resize", this.windowResize);

		if (undefined !== this.options && undefined !== this.options.subtitles) {
			setSubtitles(this.player, this.options.subtitles);
			this.applySubtitle();
		}

		this.progressBarElem = <HTMLElement>(
			this.player
				.el()
				.querySelector(".video-js .vjs-progress-holder .vjs-play-progress")
		);

		if (this.domElem && 4 === this.domElem.readyState) {
			// Video has already loaded.
			this.loadedData();
		}

		// Trigger states changes, if need.
		setTimeout(
			function (ins) {
				ins.updateVideoPlayerRatios();
			},
			100,
			this
		);
	}

	loadedData() {
		// console.log('LOADED DATA');

		this.player.removeClass("vjs-loading-video");

		if (
			"Auto" === this.state.theSelectedQuality ||
			"auto" === this.state.theSelectedQuality
		) {
			// Is valid HLS file type
			if (
				"application/x-mpegURL" === this.player.currentType() &&
				!this.initedBandwidthUpdateCallback
			) {
				this.initedBandwidthUpdateCallback = true;
				this.player.tech().on("bandwidthupdate", this.onBandwidthUpdateCallback);
				this.onBandwidthUpdateCallback();
			}
		} else {
			if (this.initedBandwidthUpdateCallback) {
				this.initedBandwidthUpdateCallback = false;
				this.player.tech().off("bandwidthupdate", this.onBandwidthUpdateCallback);
			}

			if (
				"application/x-mpegURL" === this.player.currentType() &&
				!this.initedHlsRetryPlaylistCallback
			) {
				// Catch invalid playlists when selected resolution is not "Auto".
				this.initedHlsRetryPlaylistCallback = true;
				this.player.tech().on("retryplaylist", this.onHlsRetryPlaylistCallback);
			}
		}

		if (this.isChangingResolution) {
			if (this.hadStartedOnResolutionChange) {
				this.player.hasStarted(true);
				this.player.removeClass("vjs-changing-resolution");
				this.hadStartedOnResolutionChange = false;
			}

			if (this.wasPlayingOnResolutionChange) {
				this.player.play();
				this.wasPlayingOnResolutionChange = false;
			} else {
				this.player.pause();
			}

			this.isChangingResolution = false;
		}

		this.updateVideoElementPosition();
	}

	windowResize() {
		this.updateVideoPlayerRatios();
	}

	eventsListener(type: string, args?: { [key: string]: any }) {
		// console.log('EVENT:', type);
		switch (type) {
			case "error":
				if (!this.player.paused()) {
					this.player.pause();
				}
				this.player.reset();
				break;
			case "playing":
				this.setState({ playing: true });
				break;
			case "ended":
				this.setState({ ended: true });
				break;
			case "timeupdate":
				break;
			case "seeking":
				this.refreshProgressBar();
				break;
			case "seeked":
				// this.showBuffering = false;
				// const buffered = this.player.buffered();
				// console.log( "SEEKED", this.player.bufferedPercent(), buffered );
				break;
			case "dispose":
				window.removeEventListener("resize", this.windowResize);
				break;
			case "volumechange":
				this.setState({
					volume: this.player.volume(),
					soundMuted: this.player.muted(),
				});
				break;
			case "fullscreenchange":
				if (this.fullscreenTimeout) {
					clearTimeout(this.fullscreenTimeout);
				}
				this.player.addClass("vjs-fullscreen-change");
				this.fullscreenTimeout = setTimeout(() => {
					this.player.removeClass("vjs-fullscreen-change");
					this.fullscreenTimeout = undefined;
				}, 100);
				this.updateVideoElementPosition();
				break;
			case "theatermodechange":
				this.setState({ theaterMode: !this.state.theaterMode });
				break;
			case "clicknext":
				// console.log('CLICKED NEXT');
				if (this.nextButtonClickCallback) {
					this.nextButtonClickCallback();
				}
				break;
			case "clickprevious":
				// console.log('CLICKED PREVIOUS');
				if (this.previousButtonClickCallback) {
					this.previousButtonClickCallback();
				}
				break;
			case "subtitlesPaneChange":
				if (this.state.isOpenSubtitlesOptions) {
					this.hideSubtitlesPane(args && args.keyboardTrigger);
				} else {
					this.showSubtitlesPane(args && args.keyboardTrigger);
				}
				break;
			case "settingsMainPaneChange":
				if (this.state.isOpenSettingsOptions) {
					this.hideMainSettingsPane(args && args.keyboardTrigger);
				} else {
					this.showMainSettingsPane(args && args.keyboardTrigger);
				}
				break;
			case "playbackRateChange":
				// console.log('PLAYBACK RATE CHANGE', args);
				if (args && args.value) {
					this.setState({
						theSelectedPlaybackSpeed: args.value,
						closeSettings: new Date(),
						closeSettingsFromKeyboard: false,
						isOpenSettingsOptions: false,
					});
					this.player.playbackRate(args.value);
					this.player.trigger("hideMainSettingsPane");
				}
				break;
			case "qualityChange":
				// console.log('QUALITY CHANGE', args);
				if (args && args.value) {
					this.setState({
						theSelectedQuality: args.value,
						closeSettings: new Date(),
						closeSettingsFromKeyboard: false,
						isOpenSettingsOptions: false,
					});
					this.applyResolution();
					this.player.trigger("hideMainSettingsPane");
				}
				break;
			case "subtitleChange":
				// console.log('SUBTITLE CHANGE', args);
				if (args && args.value) {
					this.setState({
						theSelectedSubtitleOption: args.value,
						closeSubtitles: new Date(),
						closeSubtitlesFromKeyboard: false,
						isOpenSubtitlesOptions: false,
					});
					this.applySubtitle();
					this.player.trigger("hideSubtitlesPane");
				}
				break;
			case "userinactive":
				this.setState({
					closeSettings: new Date(),
					closeSettingsFromKeyboard: false,
					isOpenSettingsOptions: false,
					closeSubtitles: new Date(),
					closeSubtitlesFromKeyboard: false,
					isOpenSubtitlesOptions: false,
				});
				this.player.trigger("hideMainSettingsPane");
				this.player.trigger("hideSubtitlesPane");
				break;
		}
	}

	handleStateChanged(ev: StateChangedEvent): void {
		if (!ev.changes) {
			return;
		}

		// console.log( '=>', ev.changes );

		/*if ('theSelectedQuality' === ev.changes || undefined !== ev.changes.theSelectedQuality ) {
				// this.player.trigger('updatedSelectedQuality');
		}

		if ('theSelectedPlaybackSpeed' === ev.changes || undefined !== ev.changes.theSelectedPlaybackSpeed) {
				this.player.trigger('updatedSelectedPlaybackSpeed');
		}

		if ('theSelectedSubtitleOption' === ev.changes || undefined !== ev.changes.theSelectedSubtitleOption) {
				this.player.trigger('updatedSelectedSubtitleOption');
		}*/

		if (ev.changes.videoRatio || ev.changes.playerRatio) {
			this.updateVideoElementPosition();
		}

		if ("theaterMode" === ev.changes || undefined !== ev.changes.theaterMode) {
			if (this.state.theaterMode) {
				this.player.addClass("vjs-theater-mode");
			} else {
				this.player.removeClass("vjs-theater-mode");
			}

			// @note: Need this delay to allow complete function 'updateTheaterModeClassname'.
			// @todo: Recheck this. Is useful this delay?

			setTimeout(
				function (ins) {
					ins.updateVideoPlayerRatios();
				},
				20,
				this
			);
		}

		// TODO: Continue here...
		if (
			-1 <
			[
				"volume",
				"soundMuted",
				"theaterMode",
				"theSelectedQuality",
				"theSelectedPlaybackSpeed",
				"theSelectedSubtitleOption",
			].indexOf(ev.changes)
		) {
			if (this.stateUpdateCallback) {
				this.stateUpdateCallback({
					volume: this.state.volume,
					soundMuted: this.state.soundMuted,
					theaterMode: this.state.theaterMode,
					quality: this.state.theSelectedQuality,
					playbackSpeed: this.state.theSelectedPlaybackSpeed,
					subtitle: this.state.theSelectedSubtitleOption,
				});
			}
		}

		// if( -1 < [ 'isOpenSettingsOptions', 'isOpenQualityOptions', 'isOpenPlaybackSpeedOptions', 'theSelectedQuality', 'theSelectedPlaybackSpeed' ].indexOf( ev.changes ) ){
		//   this.player.trigger('updatedSettingsPanelsVisibility');
		// }

		/*if ( ( 'openSettings' === ev.changes || undefined !== ev.changes.openSettings ) && this.state.openSettings) {
				this.player.trigger('openedSettingsPanel', this.state.openSettingsFromKeyboard);
			}

			if ( ( 'closeSettings' === ev.changes || undefined !== ev.changes.closeSettings ) && this.state.closeSettings) {
				this.player.trigger('closedSettingsPanel', this.state.closeSettingsFromKeyboard);
			}

			if ( ( 'openSubtitles' === ev.changes || undefined !== ev.changes.openSubtitles ) && this.state.openSubtitles) {
				this.player.trigger('openedSubtitlesPanel', this.state.openSubtitlesFromKeyboard);
			}

			if ( ( 'closeSubtitles' === ev.changes || undefined !== ev.changes.closeSubtitles ) && this.state.closeSubtitles) {
				this.player.trigger('closedSubtitlesPanel', this.state.closeSubtitlesFromKeyboard);
			}*/
	}

	updateVideoPlayerRatios() {
		const playerElement = <HTMLElement>this.player.el();

		if (this.domElem) {
			this.setState({
				videoRatio: this.domElem.offsetWidth / this.domElem.offsetHeight,
				playerRatio: playerElement.offsetWidth / playerElement.offsetHeight,
			});

			let settingsPanelInner = document.querySelectorAll(
				".vjs-settings-panel-inner"
			);

			// TODO: Recheck this.
			if (settingsPanelInner.length) {
				// Set panels max-height.
				var i = 0;
				while (i < settingsPanelInner.length) {
					(<HTMLElement>settingsPanelInner[i]).style.maxHeight =
						this.domElem.offsetHeight - 120 + "px";
					i += 1;
				}
			}
		}
	}

	updateVideoElementPosition() {
		if (this.domElem) {
			if (this.videoNativeDimensions) {
				const playerElement = <HTMLElement>this.player.el();

				const newval = centralizeBoxPosition(
					this.domElem.offsetWidth,
					this.domElem.offsetHeight,
					this.state.videoRatio,
					playerElement.offsetWidth,
					playerElement.offsetHeight,
					this.state.playerRatio
				);

				// @note: Don't need because we are set in CSS the properties "max-width:100%;" and "max-height:100%;" of <video> element and wont exceed available player space.
				/* this.videoHtmlElem.style.width = newval.w + 'px';
        this.videoHtmlElem.style.height = newval.h + 'px';*/

				if (this.csstransforms) {
					applyCssTransform(
						this.domElem,
						"translate(" +
							(newval.l > 0 ? newval.l : "0") +
							"px," +
							(newval.t > 0 ? newval.t : "0") +
							"px)"
					);
				} else {
					this.domElem.style.top = newval.t > 0 ? newval.t + "px" : "";
					this.domElem.style.left = newval.l > 0 ? newval.l + "px" : "";
				}
			} else {
			}
		}
	}

	onBandwidthUpdateCallback() {
		this.player.trigger("updatedBandwidth");
	}

	onHlsRetryPlaylistCallback(ev: Event) {
		console.warn("onHlsRetryPlaylistCallback");

		if (
			"Auto" !== this.state.theSelectedQuality &&
			this.videoResolutions &&
			undefined !== this.videoResolutions["Auto"]
		) {
			this.setState({
				theSelectedQuality: "Auto",
			});

			this.applyResolution();
		}
	}

	refreshProgressBar() {
		if (this.progressBarElem) {
			this.progressBarElem.style.width =
				((100 * this.player.currentTime()) / this.player.duration()).toFixed(2) +
				"%";
		}
	}

	applySubtitle() {
		const tracks = this.player.textTracks();
		// console.log( 'APPLY SUBTITLE:', this.state.theSelectedSubtitleOption );
		// console.log( tracks.length, typeof tracks, tracks );
		for (let i = 0; i < tracks.length; i++) {
			// console.log( tracks[i] );
			// console.log( tracks[i].kind, tracks[i].language, tracks[i].label );
			if ("subtitles" === tracks[i].kind) {
				tracks[i].mode =
					this.state.theSelectedSubtitleOption === tracks[i].language
						? "showing"
						: "hidden";
			}
		}
		// console.log( tracks );
	}

	applyResolution() {
		this.isChangingResolution = true;

		const sources = [];
		const currentTime = this.player.currentTime();
		const duration = this.player.duration();

		this.wasPlayingOnResolutionChange = !this.player.paused();
		this.hadStartedOnResolutionChange = this.player.hasStarted();

		if (this.hadStartedOnResolutionChange) {
			this.player.addClass("vjs-changing-resolution");
		}

		if (this.videoResolutions) {
			let i = 0;
			while (i < this.videoResolutions[this.state.theSelectedQuality].src.length) {
				sources.push({
					src: this.videoResolutions[this.state.theSelectedQuality].src[i],
				});
				i += 1;
			}
		}

		this.player.src(sources); // Load sources in provided order.
		(<any>this.player).techCall_("reset");
		this.player.currentTime(currentTime);
		this.player.duration(duration);
		this.player.playbackRate(this.state.theSelectedPlaybackSpeed);
	}

	isEnded() {
		return this.player.ended();
	}
	isTheaterMode() {
		return this.state.theaterMode;
	}
	isFullscreen() {
		return this.player.isFullscreen();
	}
}

export { MediacmsVjsPlugin };
