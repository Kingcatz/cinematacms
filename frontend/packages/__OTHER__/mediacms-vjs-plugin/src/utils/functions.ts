import videojs, { VideoJsPlayer } from "video.js";

const isArray = (v: any): boolean =>
	!Array.isArray
		? "[object Array]" === Object.prototype.toString.call(v)
		: Array.isArray(v);
const isBoolean = (v: any): boolean =>
	"boolean" === typeof v || v instanceof Boolean;
const isInteger = (v: any): boolean => !isNaN(v) && v === parseInt(v, 10);
const isPositiveInteger = (v: any): boolean => isInteger(v) && 0 < v;
const isString = (v: any): boolean =>
	"string" === typeof v || v instanceof String;

function browserSupports_csstransforms() {
	const docElem = document.body || document.documentElement;

	if (docElem) {
		if (isString(docElem.style.transition)) {
			return true;
		}

		const v = ["Moz", "webkit", "Webkit", "Khtml", "O", "ms"];
		let p = "transition";
		p = p.charAt(0).toUpperCase() + p.substr(1);

		let x: any;
		let i = 0;
		while (i < v.length) {
			x = v[i] + p;
			if (isString(docElem.style[x])) {
				return true;
			}
			i += 1;
		}
	}

	return false;
}

export function browserSupports(type: string) {
	switch (type) {
		case "csstransforms":
			return browserSupports_csstransforms();
	}
}

export function applyCssTransform(elem: HTMLElement, val: any) {
	val = val.replace(/ /g, ""); // Remove all blank characters, otherwise doesn't work in IE.
	elem.style.transform = val;
	// elem.style.msTransform = val;
	// elem.style.MozTransform = val;
	// elem.style.WebkitTransform = val;
	// elem.style.OTransform = val;
}

export function centralizeBoxPosition(
	vw: number,
	vh: number,
	vr: number,
	pw: number,
	ph: number,
	pr: number
) {
	const ret: { w: number; h: number; t: number; l: number } = {
		w: 0,
		h: 0,
		t: 0,
		l: 0,
	};

	const videoRatio = undefined !== vr && null !== vr ? vr : vw / vh;
	const playerRatio = undefined !== pr && null !== pr ? pr : pw / ph;
	const playerVerticalOrientation = 1 > playerRatio;
	const videoVerticalOrientation = 1 > videoRatio;

	if (!playerVerticalOrientation) {
		if (!videoVerticalOrientation) {
			// Both ARE NOT "vertical";

			if (videoRatio > playerRatio) {
				if (vw >= pw) {
					ret.w = pw;
					ret.h = ret.w / videoRatio;
				} else {
					ret.w = vw;
					ret.h = vh;
				}
			} else {
				ret.h = vw >= pw ? ph : vh >= ph ? ph : vh;
				ret.w = ret.h * videoRatio;
			}
		} else {
			// Video IS "vertical" and player IS NOT "vertical";

			if (vh >= ph) {
				ret.h = ph;
				ret.w = ret.h * videoRatio;
			} else {
				ret.w = vw;
				ret.h = vh;
			}
		}
	} else if (!videoVerticalOrientation) {
		// Player IS "vertical" and video IS NOT "vertical";

		if (vw >= pw) {
			ret.w = pw;
			ret.h = ret.w / videoRatio;
		} else {
			ret.w = vw;
			ret.h = vh;
		}
	} else {
		// Both ARE "vertical";

		if (videoRatio > playerRatio) {
			if (vw >= pw) {
				ret.w = pw;
				ret.h = ret.w / videoRatio;
			} else {
				ret.w = vw;
				ret.h = vh;
			}
		} else if (vw >= pw) {
			ret.h = ph;
			ret.w = ret.h * videoRatio;
		} else if (vh >= ph) {
			ret.h = ph;
			ret.w = ret.h * videoRatio;
		} else {
			ret.w = vw;
			ret.h = vh;
		}
	}

	ret.t = (ph - ret.h) / 2;
	ret.l = (pw - ret.w) / 2;

	return ret;
}

export function filterInputOptions(input?: mediacmsVjsPlugin.InputOptions) {
	const ret: mediacmsVjsPlugin.InputOptions = {};

	if (undefined !== input) {
		ret.loop = isBoolean(input.loop) ? input.loop : false;
		ret.liveui = isBoolean(input.liveui) ? input.liveui : false;
		ret.controls = isBoolean(input.controls) ? input.controls : true;
		(ret.poster =
			undefined !== input.poster &&
			isString(input.poster) &&
			input.poster.trim().length
				? input.poster
				: ""),
			/* -------------------- */
			(ret.autoplay =
				undefined !== input.autoplay &&
				-1 < ["any", "play", "muted", true, false].indexOf(input.autoplay)
					? input.autoplay
					: false);
		ret.controlBar = {
			time:
				undefined !== input.controlBar && isBoolean(input.controlBar.time)
					? input.controlBar.time
					: true,
			play:
				undefined !== input.controlBar && isBoolean(input.controlBar.play)
					? input.controlBar.play
					: true,
			next:
				undefined !== input.controlBar && isBoolean(input.controlBar.next)
					? input.controlBar.next
					: false,
			previous:
				undefined !== input.controlBar && isBoolean(input.controlBar.previous)
					? input.controlBar.previous
					: false,
			volume:
				undefined !== input.controlBar && isBoolean(input.controlBar.volume)
					? input.controlBar.volume
					: true,
			progress:
				undefined !== input.controlBar && isBoolean(input.controlBar.progress)
					? input.controlBar.progress
					: true,
			fullscreen:
				undefined !== input.controlBar && isBoolean(input.controlBar.fullscreen)
					? input.controlBar.fullscreen
					: true,
			/* ----- Extra options ----- */
			theaterMode:
				undefined !== input.controlBar && isBoolean(input.controlBar.theaterMode)
					? input.controlBar.theaterMode
					: true,
			pictureInPicture:
				undefined !== input.controlBar &&
				isBoolean(input.controlBar.pictureInPicture)
					? input.controlBar.pictureInPicture
					: true,
			bottomBackground:
				undefined !== input.controlBar &&
				isBoolean(input.controlBar.bottomBackground)
					? input.controlBar.bottomBackground
					: true,
		};
		ret.preload =
			undefined !== input.preload &&
			-1 < ["auto", "metadata", "none"].indexOf(input.preload)
				? input.preload
				: "auto";
		ret.sources = [];
		if (undefined !== input.sources && isArray(input.sources)) {
			input.sources.forEach((val) => {
				if (undefined !== val.src && isString(val.src) && val.src.trim().length) {
					ret.sources = undefined === ret.sources ? [] : ret.sources;
					ret.sources.push({ src: val.src, type: val.type });
				}
			});
		}
		/* -------------------- */
		ret.keyboardControls = isBoolean(input.keyboardControls)
			? input.keyboardControls
			: true;
		ret.nativeDimensions = isBoolean(input.nativeDimensions)
			? input.nativeDimensions
			: false;
		ret.suppressNotSupportedError = isBoolean(input.suppressNotSupportedError)
			? input.suppressNotSupportedError
			: true;
		ret.enabledTouchControls = isBoolean(input.enabledTouchControls)
			? input.enabledTouchControls
			: true;
		ret.bigPlayButton = isBoolean(input.bigPlayButton)
			? input.bigPlayButton
			: true;
		/* ----- Extra options ----- */
		ret.subtitles = {
			on:
				undefined !== input.subtitles && isBoolean(input.subtitles.on)
					? input.subtitles.on
					: false,
			languages:
				undefined !== input.subtitles && isArray(input.subtitles.languages)
					? input.subtitles.languages
					: [],
			default:
				undefined !== input.subtitles && undefined !== input.subtitles.default
					? input.subtitles.default
					: null,
		};
		if (ret.subtitles.languages.length) {
			ret.subtitles.languages.unshift({ label: "Off", srclang: "off", src: "" });
		}
		ret.cornerLayers = {
			topLeft:
				undefined !== input.cornerLayers &&
				(isString(input.cornerLayers.topLeft) ||
					Node.prototype.isPrototypeOf(<Object>input.cornerLayers.topLeft))
					? input.cornerLayers.topLeft
					: null,
			topRight:
				undefined !== input.cornerLayers &&
				(isString(input.cornerLayers.topRight) ||
					Node.prototype.isPrototypeOf(<Object>input.cornerLayers.topRight))
					? input.cornerLayers.topRight
					: null,
			bottomLeft:
				undefined !== input.cornerLayers &&
				(isString(input.cornerLayers.bottomLeft) ||
					Node.prototype.isPrototypeOf(<Object>input.cornerLayers.bottomLeft))
					? input.cornerLayers.bottomLeft
					: null,
			bottomRight:
				undefined !== input.cornerLayers &&
				(isString(input.cornerLayers.bottomRight) ||
					Node.prototype.isPrototypeOf(<Object>input.cornerLayers.bottomRight))
					? input.cornerLayers.bottomRight
					: null,
		};
		ret.videoPreviewThumb = {
			url:
				undefined !== input.videoPreviewThumb &&
				isString(input.videoPreviewThumb.url) &&
				input.videoPreviewThumb.url.trim().length
					? input.videoPreviewThumb.url
					: "",
			frame: {
				width:
					undefined !== input.videoPreviewThumb &&
					undefined !== input.videoPreviewThumb.frame &&
					isPositiveInteger(input.videoPreviewThumb.frame.width)
						? input.videoPreviewThumb.frame.width
						: 160,
				height:
					undefined !== input.videoPreviewThumb &&
					undefined !== input.videoPreviewThumb.frame &&
					isPositiveInteger(input.videoPreviewThumb.frame.height)
						? input.videoPreviewThumb.frame.height
						: 90,
				seconds:
					undefined !== input.videoPreviewThumb &&
					undefined !== input.videoPreviewThumb.frame &&
					isPositiveInteger(input.videoPreviewThumb.frame.seconds)
						? input.videoPreviewThumb.frame.seconds
						: 10,
			},
		};
	}

	return ret;
}

export function filterInputState(
	input?: Partial<mediacmsVjsPlugin.InputState>
) {
	const ret: Partial<mediacmsVjsPlugin.InputState> = {};

	if (undefined !== input) {
		if (undefined !== input.volume && !isNaN(input.volume)) {
			ret.volume = input.volume;
		}

		if (undefined !== input.soundMuted && isBoolean(input.soundMuted)) {
			ret.soundMuted = input.soundMuted;
		}

		if (undefined !== input.theaterMode && isBoolean(input.theaterMode)) {
			ret.theaterMode = input.theaterMode;
		}

		if (undefined !== input.theSelectedQuality && input.theSelectedQuality) {
			ret.theSelectedQuality = input.theSelectedQuality;
		}

		if (
			undefined !== input.theSelectedPlaybackSpeed &&
			-1 <
				[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].indexOf(
					input.theSelectedPlaybackSpeed
				)
		) {
			ret.theSelectedPlaybackSpeed = input.theSelectedPlaybackSpeed;
		}

		if (
			undefined !== input.theSelectedSubtitleOption &&
			null !== input.theSelectedSubtitleOption &&
			isString(input.theSelectedSubtitleOption) &&
			input.theSelectedSubtitleOption.trim().length
		) {
			ret.theSelectedSubtitleOption = input.theSelectedSubtitleOption;
		}
	}

	return ret;
}

export function filterPlaybackSpeeds(
	input?: mediacmsVjsPlugin.InputPlaybackSpeed[]
) {
	const ret: mediacmsVjsPlugin.InputPlaybackSpeed[] = [];

	if (undefined !== input) {
		input.forEach((v) => {
			if (
				undefined !== v.speed &&
				-1 < [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].indexOf(v.speed)
			) {
				ret.push({
					title:
						undefined !== v.title
							? v.title.toString()
							: 1 === v.speed
							? "Normal"
							: v.speed.toString(),
					speed: v.speed,
				});
			}
		});
	}

	return ret;
}

export function filterVideoResolutions(
	input?: mediacmsVjsPlugin.InputResolutions
) {
	const ret: mediacmsVjsPlugin.InputResolutions = {};

	if (undefined !== input) {
		for (const k in input) {
			if (
				undefined !== input[k] &&
				-1 < ["240", "360", "480", "720", "1080", "Auto", "auto"].indexOf(k)
			) {
				if (
					isArray(input[k].src) &&
					isArray(input[k].format) &&
					input[k].src.length &&
					input[k].src.length === input[k].format.length
				) {
					ret[k] = {
						src: input[k].src,
						format: input[k].format,
						title:
							isString(input[k].title) && input[k].title.trim().length
								? input[k].title
								: "auto" === k
								? "Auto"
								: k,
					};
				}
				// @todo: ...
				// else{
				// throw Error();
				// }
			}
		}
	}

	return ret;
}

export function initialResolutionFilter(
	defaultSource: string,
	defaultResolution: string,
	availabeResolutions: mediacmsVjsPlugin.InputResolutions
) {
	const ret: {
		initialResolution: string;
		resolutionOrder?: number;
		resolutionFormat?: mediacmsVjsPlugin.VideoFormat;
	} = { initialResolution: "" };

	const resolutionKeys = Object.keys(availabeResolutions);

	if (resolutionKeys.length) {
		const index = resolutionKeys.indexOf(defaultResolution);
		if (-1 < index) {
			ret.resolutionOrder = index;
			ret.resolutionFormat = availabeResolutions[defaultResolution].format[index];
			return ret;
		}
	}

	for (const k in availabeResolutions) {
		let i = 0;
		while (i < availabeResolutions[k].src.length) {
			if (defaultSource === availabeResolutions[k].src[i]) {
				ret.resolutionOrder = i;
				ret.resolutionFormat = availabeResolutions[k].format[i];
				ret.initialResolution = k;
				return ret;
			}
			i += 1;
		}
	}

	ret.resolutionOrder = 0;
	ret.initialResolution = resolutionKeys[0];
	ret.resolutionFormat = availabeResolutions[resolutionKeys[0]].format[0];

	return ret;
}

export function handleControlElemFocus(elem?: Element) {
	if (!elem) {
		return;
	}

	let isMouseDown = false;
	let isKeyboardFocus = false;

	function onFocus(e: Event) {
		if (!isMouseDown) {
			isKeyboardFocus = true;
			(<HTMLElement>e.target).setAttribute("key-focus", "");
		}
	}

	function onBlur(e: Event) {
		if (isKeyboardFocus) {
			isKeyboardFocus = false;
			(<HTMLElement>e.target).removeAttribute("key-focus");
		}
	}

	elem.addEventListener("blur", onBlur);
	elem.addEventListener("focus", onFocus);
	elem.addEventListener("mouseup", function () {
		isMouseDown = false;
	});
	elem.addEventListener("mousedown", function () {
		isMouseDown = true;
	});
}

export function controlElementsFocus(player: VideoJsPlayer) {
	const controlBar = player.getChild("controlBar");
	const progressControl = controlBar?.getChild("progressControl");

	const elems = {
		seekBar: progressControl?.getChild("seekBar"),
	};

	if (void 0 !== elems.seekBar) {
		handleControlElemFocus(elems.seekBar.el());
	}
}
