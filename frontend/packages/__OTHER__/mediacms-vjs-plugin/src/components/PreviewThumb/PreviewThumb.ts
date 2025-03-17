import videojs from "video.js";

import "./PreviewThumb.scss";

const VideoJsComponent = videojs.getComponent("Component");

function offsetParentElem(el: HTMLElement | null): HTMLElement | null {
	return el &&
		"HTML" !== el.nodeName &&
		window.getComputedStyle(el) &&
		"static" === window.getComputedStyle(el).position
		? offsetParentElem(<HTMLElement>el.offsetParent)
		: el;
}

interface BorderWidth {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

interface PreviewThumbMouseTimeOptions extends videojs.ComponentOptions {
	time: number;
}

interface PreviewThumbMouseTime {
	options_: PreviewThumbMouseTimeOptions;
	constructor(
		player: videojs.Player,
		options?: PreviewThumbMouseTimeOptions,
		ready?: videojs.Component.ReadyCallback
	): PreviewThumb;
	buildCSSClass(): string;
	buildTime(): void;
	updateTime(time: number): void;
}

class PreviewThumbMouseTime
	extends VideoJsComponent
	implements PreviewThumbMouseTime
{
	time: number;
	inner: videojs.Component;

	constructor(
		player: videojs.Player,
		options?: PreviewThumbMouseTimeOptions,
		ready?: videojs.Component.ReadyCallback
	) {
		super(player, options, ready);
		this.time = options ? options.time || 0 : 0;
		this.inner = new VideoJsComponent(player);
		this.addChild(this.inner);
		this.setAttribute("class", this.buildCSSClass());
		this.buildTime();
	}

	buildCSSClass() {
		return "vjs-preview-thumb-time-display";
	}

	buildTime() {
		this.inner.el().innerHTML = videojs.formatTime(this.time, 600);
	}

	updateTime(time: number) {
		this.time = time;
		this.buildTime();
	}
}

interface PreviewThumbInnerOptions extends videojs.ComponentOptions {
	url: string;
	frame: mediacmsVjsPlugin.IVideoSpriteFormat;
}

interface PreviewThumbInner extends videojs.Component {
	options_: PreviewThumbInnerOptions;
	constructor(
		player: videojs.Player,
		options?: PreviewThumbInnerOptions,
		ready?: videojs.Component.ReadyCallback
	): PreviewThumb;
	buildCSSClass(): string;
	buildStyles(): string;
	onInitialPlay(): void;
	onFullscreenChange(): void;
	onThumbImageLoad(ev: Event): void;
	updateDimensions(): void;
	thumbHeight(): number;
	updateStyle(prop: string, value: string): void;
}

class PreviewThumbInner extends VideoJsComponent implements PreviewThumbInner {
	inFullscreen: boolean;
	thumbSrc = "";
	thumbNaturalHeight = 0;
	thumbWidth = 0;
	borderWidth: BorderWidth = { top: 0, left: 0, right: 0, bottom: 0 };
	thumbFrame: mediacmsVjsPlugin.IVideoSpriteFormat = {
		width: 160,
		height: 120,
		seconds: 10,
	};
	styles: { [prop: string]: string } = {};

	constructor(
		player: videojs.Player,
		options?: PreviewThumbInnerOptions,
		ready?: videojs.Component.ReadyCallback
	) {
		super(player, options, ready);

		this.inFullscreen = player.isFullscreen() || false;

		if (options) {
			this.thumbSrc = options.url;
			this.thumbFrame = options.frame;

			if (this.thumbSrc) {
				this.styles["background-image"] = 'url("' + this.thumbSrc + '")';
			}
		}

		this.setAttribute("class", this.buildCSSClass());
		this.setAttribute("style", this.buildStyles());

		this.onInitialPlay = this.onInitialPlay.bind(this);
		this.onFullscreenChange = this.onFullscreenChange.bind(this);
		this.onThumbImageLoad = this.onThumbImageLoad.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);

		player.one("playing", this.onInitialPlay);
		player.on("fullscreenchange", this.onFullscreenChange);
	}

	buildCSSClass() {
		return "vjs-preview-thumb-inner";
	}

	buildStyles() {
		let styles = "";
		Object.keys(this.styles).forEach((prop) => {
			if (this.styles[prop]) {
				if (styles) {
					styles += ";";
				}
				styles += prop + ":" + this.styles[prop];
			} else {
				delete this.styles[prop];
			}
		});
		return styles;
	}

	onInitialPlay() {
		if (this.thumbSrc) {
			const img = document.createElement("img");
			img.onload = this.onThumbImageLoad;
			img.src = this.thumbSrc;
		}
	}

	onFullscreenChange() {
		this.inFullscreen = this.player().isFullscreen();
		setTimeout(this.updateDimensions, 100);
	}

	onThumbImageLoad(ev: Event) {
		const styles = window.getComputedStyle(this.el());

		this.borderWidth.top = parseFloat(styles.borderTopWidth);
		this.borderWidth.left = parseFloat(styles.borderLeftWidth);
		this.borderWidth.right = parseFloat(styles.borderRightWidth);
		this.borderWidth.bottom = parseFloat(styles.borderBottomWidth);

		this.thumbNaturalHeight = (<HTMLImageElement>ev.currentTarget).naturalHeight;

		this.updateDimensions();
	}

	updateDimensions() {
		if (this.inFullscreen) {
			this.thumbWidth =
				this.borderWidth.left +
				this.borderWidth.right +
				1.5 * this.thumbFrame.width;
			this.styles.height =
				this.borderWidth.top +
				this.borderWidth.bottom +
				1.5 * this.thumbFrame.height +
				"px";
			this.styles.width =
				this.borderWidth.left +
				this.borderWidth.right +
				1.5 * this.thumbFrame.width +
				"px";
		} else {
			this.thumbWidth =
				this.borderWidth.left + this.borderWidth.right + this.thumbFrame.width;
			this.styles.height =
				this.borderWidth.top +
				this.borderWidth.bottom +
				this.thumbFrame.height +
				"px";
			this.styles.width =
				this.borderWidth.left +
				this.borderWidth.right +
				this.thumbFrame.width +
				"px";
		}
		this.styles.left = -1 * (0.5 * this.thumbWidth) + "px";
		this.setAttribute("style", this.buildStyles());
	}

	thumbHeight() {
		return this.thumbNaturalHeight;
	}

	updateStyle(prop: string, value: string) {
		if (value) {
			this.styles[prop] = value;
			this.setAttribute("style", this.buildStyles());
		} else {
			delete this.styles[prop];
		}
	}
}

interface PreviewThumbOptions extends videojs.ComponentOptions {
	url: string;
	frame: mediacmsVjsPlugin.IVideoSpriteFormat;
}

interface PreviewThumb extends videojs.Component {
	options_: PreviewThumbOptions;
	constructor(
		player: videojs.Player,
		options?: PreviewThumbOptions,
		ready?: videojs.Component.ReadyCallback
	): PreviewThumb;
	buildCSSClass(): string;
	buildStyles(): string;
	onInitialPlay(): void;
	onDurationChange(): void;
	onClick(): void;
	onMouseOverProgressControl(event: MouseEvent): void;
	onMouseEnterProgressControl(): void;
	onMouseLeaveProgressControl(): void;
}

class PreviewThumb extends VideoJsComponent implements PreviewThumb {
	duration: number;
	progressControl: videojs.Component | undefined;
	innerComp: PreviewThumbInner;
	timeDisplayComp: PreviewThumbMouseTime;
	frameDimensions: mediacmsVjsPlugin.IVideoSpriteFormat;
	styles: { [prop: string]: string } = {};
	className = "";
	visibilityTimeout: NodeJS.Timeout | null = null;
	isVisible = false;
	timePntr = 0;

	constructor(
		player: videojs.Player,
		options?: PreviewThumbOptions,
		ready?: videojs.Component.ReadyCallback
	) {
		super(player, options, ready);

		this.duration = player.duration() || 0;
		this.progressControl = player.controlBar.getChild("ProgressControl");

		this.frameDimensions = options
			? options.frame
			: { width: 160, height: 120, seconds: 10 };

		this.innerComp = new PreviewThumbInner(player, {
			url: options ? options.url : "",
			frame: this.frameDimensions,
		});

		this.timeDisplayComp = new PreviewThumbMouseTime(player, { time: 0 });

		if (!this.progressControl) {
			return;
		}

		this.innerComp.addChild(this.timeDisplayComp);

		this.addChild(this.innerComp);

		this.setAttribute("class", this.buildCSSClass());

		this.onInitialPlay = this.onInitialPlay.bind(this);
		this.onDurationChange = this.onDurationChange.bind(this);
		this.onMouseOverProgressControl = this.onMouseOverProgressControl.bind(this);
		this.onMouseEnterProgressControl =
			this.onMouseEnterProgressControl.bind(this);
		this.onMouseLeaveProgressControl =
			this.onMouseLeaveProgressControl.bind(this);

		player.one("playing", this.onInitialPlay);
		player.on("durationchange", this.onDurationChange); // when the container is MP4.
		player.on("loadedmetadata", this.onDurationChange); // when the container is HLS.

		this.progressControl.on("mouseover", this.onMouseOverProgressControl);
		this.progressControl.on("mousemove", this.onMouseOverProgressControl);
		this.progressControl.on("mouseenter", this.onMouseEnterProgressControl);
		this.progressControl.on("mouseleave", this.onMouseLeaveProgressControl);

		this.on("mouseover", this.onMouseOverProgressControl);
		this.on("mousemove", this.onMouseOverProgressControl);
		this.on("mouseenter", this.onMouseEnterProgressControl);
		this.on("mouseleave", this.onMouseLeaveProgressControl);

		this.onClick = this.onClick.bind(this);
	}

	buildCSSClass() {
		return "vjs-preview-thumb" + this.className;
	}

	buildStyles() {
		let styles = "";
		Object.keys(this.styles).forEach((prop) => {
			if (this.styles[prop]) {
				if (styles) {
					styles += ";";
				}
				styles += prop + ":" + this.styles[prop];
			} else {
				delete this.styles[prop];
			}
		});
		return styles;
	}

	onInitialPlay() {
		this.player().addClass("vjs-enabled-preview-thumb"); // enables functionality.
	}

	onDurationChange() {
		this.duration = this.player().duration();
	}

	onClick() {
		this.player_.currentTime(this.timePntr);
	}

	onMouseOverProgressControl(event: MouseEvent) {
		if (!this.progressControl) {
			return;
		}

		const progressControlEl = <HTMLElement>this.progressControl.el();
		const progressControlParentEl = offsetParentElem(progressControlEl);

		if (!progressControlParentEl) {
			return;
		}

		const progressControlParentClientRect =
			progressControlParentEl.getBoundingClientRect();

		const pageXOffset = window.pageXOffset
			? window.pageXOffset
			: document.documentElement.scrollLeft;
		// @todo: Recheck this.
		// var pageX = event.changedTouches ? event.changedTouches[0].pageX : event.pageX;
		const pageX = event.pageX;

		let left =
			(pageX ||
				event.clientX +
					document.body.scrollLeft +
					document.documentElement.scrollLeft) -
			(progressControlParentClientRect.left + pageXOffset);
		const right =
			(progressControlParentClientRect.width ||
				progressControlParentClientRect.right) + pageXOffset;

		let progressControlWidth = this.progressControl.width();
		progressControlWidth =
			"string" === typeof progressControlWidth
				? parseFloat(progressControlWidth)
				: progressControlWidth;

		this.timePntr = this.duration * (left / right);

		// To use in update of 'PreviewThumbInner'
		const newMouseTime = !this.innerComp.thumbHeight()
			? 0
			: Math.min(
					(this.innerComp.thumbHeight() / this.frameDimensions.height) *
						this.frameDimensions.seconds -
						1,
					Math.floor(
						((left - progressControlEl.offsetLeft) / progressControlWidth) *
							this.duration
					)
			  );

		const halfThumbWidth = this.innerComp.thumbWidth * 0.5;

		if (left < halfThumbWidth) {
			left = halfThumbWidth;
		} else if (left > right - halfThumbWidth) {
			left = right - halfThumbWidth;
		}

		// // Update 'PreviewThumb'
		this.styles.transform =
			"translate(" + Math.min(right - halfThumbWidth, left) + "px, 0px)";
		this.setAttribute("style", this.buildStyles());

		// Update 'PreviewThumbInner'
		this.innerComp.updateStyle(
			"background-position-y",
			(this.innerComp.inFullscreen ? -1.5 : -1) *
				this.frameDimensions.height *
				Math.floor(newMouseTime / this.frameDimensions.seconds) +
				"px"
		);

		// // Update 'PreviewThumbMouseTime'
		this.timeDisplayComp.updateTime(this.timePntr);
	}

	onMouseEnterProgressControl() {
		if (null !== this.visibilityTimeout) {
			clearTimeout(this.visibilityTimeout);
		}

		this.visibilityTimeout = setTimeout(() => {
			this.visibilityTimeout = null;
			if (this.isVisible) {
				return;
			}
			this.isVisible = true;
			this.on("click", this.onClick);
			this.className = " vjs-preview-thumb-visible";
			this.setAttribute("class", this.buildCSSClass());
		}, 100);
	}

	onMouseLeaveProgressControl() {
		if (null !== this.visibilityTimeout) {
			clearTimeout(this.visibilityTimeout);
		}

		this.visibilityTimeout = setTimeout(() => {
			this.visibilityTimeout = null;
			if (!this.isVisible) {
				return;
			}
			this.isVisible = false;
			this.off("click", this.onClick);
			this.className = "";
			this.setAttribute("class", this.buildCSSClass());
		}, 100);
	}
}

export { PreviewThumb };
