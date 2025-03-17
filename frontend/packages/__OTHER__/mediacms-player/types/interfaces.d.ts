interface ISettingsControlBar {
    children: any[],
    bottomBackground?: boolean,
    progress?: boolean,
    play?: boolean,
    next?: boolean,
    previous?: boolean,
    volume?: boolean,
    // @link: https://docs.videojs.com/control-bar_picture-in-picture-toggle.js.html
    pictureInPicture?: boolean,
    fullscreen?: boolean,
    theaterMode?: boolean,
    time?: boolean,
}

interface ISettingsSubtitlesLanguages {
    src: string,
    srclang: string,
    label: string,
}

interface ISettingsSubtitles {
    on: boolean,
    languages: ISettingsSubtitlesLanguages[],
    default: string | null,
}

interface ISettingsCornersLayers {
    topLeft: HTMLElement | string | null,
    topRight: HTMLElement | string | null,
    bottomLeft: HTMLElement | string | null,
    bottomRight: HTMLElement | string | null,
}

interface IVideoSources {
    src: string,
    type: VideoType,
}

// LINK: https://docs.videojs.com/tutorial-options.html
interface ISettings {
    liveui?: boolean,
    keyboardControls?: boolean,
    nativeDimensions?: boolean,
    suppressNotSupportedError?: boolean,
    preload?: 'auto' | 'metadata' | 'none',
    enabledTouchControls: boolean,
    sources: IVideoSources[],
    poster: string,
    loop: boolean,
    controls: boolean,
    autoplay: 'any' | 'play' | 'muted' | boolean,
    bigPlayButton: boolean,
    controlBar: ISettingsControlBar,
    subtitles: ISettingsSubtitles,
    cornerLayers: ISettingsCornersLayers,
    videoPreviewThumb: IVideoPreviewThumb,
}

interface IState {
    volume: number,
    soundMuted: boolean,
    theaterMode: boolean,
    theSelectedQuality: any,
    theSelectedPlaybackSpeed: VideoPlaybackSpeed,
    theSelectedSubtitleOption: string | null,
}

// interface IState extends mediacmsVjsPlugin.InitialState{}

interface IVideoResolution {
    // Same size arrays.
    url: string[],
    format: VideoFormat[],
}

interface IVideoSpriteFormat {
    width: number,
    height: number,
    seconds: number,
}

interface IVideoPreviewThumb {
    url: string,
    frame: IVideoSpriteFormat,
}