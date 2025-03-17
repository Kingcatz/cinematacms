declare namespace mediacmsVjsPlugin {

    interface State{
        volume: number, // Decimal, 0 ~ 1
        theaterMode: boolean,
        soundMuted: boolean,
        ended: boolean,
        playing: boolean,
        videoRatio: number,
        playerRatio: number,
        isOpenSettingsOptions: boolean,
        isOpenSubtitlesOptions: boolean,
        theSelectedQuality: VideoResolution,
        theSelectedSubtitleOption: string | null,
        theSelectedAutoQuality: VideoResolution,
        theSelectedPlaybackSpeed: VideoPlaybackSpeed,
        openSettings: boolean,
        closeSettings: boolean,
        openSettingsFromKeyboard: boolean,
        closeSettingsFromKeyboard: boolean,
        openSubtitles: boolean,
        openSubtitlesFromKeyboard: boolean,
        closeSubtitles: boolean,
        closeSubtitlesFromKeyboard: boolean,
    }

    interface InputState {
        volume?: number,
        soundMuted?: boolean,
        theaterMode?: boolean,
        theSelectedQuality?: any,
        theSelectedPlaybackSpeed?: VideoPlaybackSpeed,
        theSelectedSubtitleOption?: string | null,
    }

    // LINK: https://docs.videojs.com/tutorial-options.html
    interface InputOptions extends videojs.VideoJsPlayerOptions{
        loop?: boolean,
        liveui?: boolean,
        controls?: boolean,
        poster?: string,
        /* -------------------- */
        autoplay?: boolean | 'any' | 'play' | 'muted',
        controlBar?: InputOptionsControlBar,
        preload?: 'auto' | 'metadata' | 'none',
        sources?: VideoSource[],
        /* -------------------- */
        suppressNotSupportedError?: boolean,
        enabledTouchControls?: boolean,
        bigPlayButton?: boolean,
        /* ----- Extra options ----- */
        keyboardControls?: boolean,  // TODO: Recheck this. Maybe it's better to use it outside the input options.
        nativeDimensions?: boolean,  // TODO: Recheck this, probably doesn't need.
        subtitles?: ISettingsSubtitles,
        cornerLayers?: ISettingsCornersLayers,
        videoPreviewThumb?: IVideoPreviewThumb,
        resolutions?: {
            default: string,
            options: InputResolutions,
        },
        playbackSpeeds?: {
            default: number,
            options: InputPlaybackSpeed[],
        }
    }

    interface InputOptionsControlBar /*extends ControlBarOptions*/{
        // children: any[],
        /* -------------------- */
        time?: boolean,
        play?: boolean,
        next?: boolean,
        previous?: boolean,
        volume?: boolean,
        progress?: boolean,
        fullscreen?: boolean,
        /* ----- Extra options ----- */
        theaterMode?: boolean,
        // @link: https://docs.videojs.com/control-bar_picture-in-picture-toggle.js.html
        pictureInPicture?: boolean,
        bottomBackground?: boolean
    }

    interface VideoSource /*extends videojs.Tech.SourceObject*/ {
        src: string,
        type?: VideoMimeType,
    }

    interface InputResolution { 
        src: string[],
        format: VideoFormat[],
        // title: VideoResolution
        title: string
    }

    interface InputResolutions {
        [key: string]: InputResolution
    }

    interface InputPlaybackSpeed {
        title: string,
        speed: VideoPlaybackSpeed,
    }

    // /* ################################################## */

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

    /*interface IVideoResolution {
        // Same size arrays.
        url: string[],
        format: VideoFormat[],
    }*/

    interface IVideoSpriteFormat {
        width: number,
        height: number,
        seconds: number,
    }

    interface IVideoPreviewThumb {
        url: string,
        frame: IVideoSpriteFormat,
    }
}
