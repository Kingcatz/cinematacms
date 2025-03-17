import { VideoJsPlayer } from 'video.js';

// declare module 'video.js' {
//     export interface VideoJsPlayer {
//         mediacmsVjsPlugin: (
//             domPlayer: HTMLVideoElement | HTMLAudioElement,
//             options: ISettings,
//             state: IState,
//             resolutions: { [key in VideoResolution]?: { title: VideoResolution, src: string[], format: VideoFormat[] } },
//             playbackSpeeds: {
//                 title: string | 0.25 | 0.5 | 0.75 | 1.25 | 1.5 | 1.75 | 2;
//                 speed: VideoPlaybackSpeed;
//             }[],
//             pluginStateUpdateCallback?: Function,
//             onNextButtonClick?: Function,
//             onPrevButtonClick?: Function
//         ) => MediacmsVjsPlugin;
//     }
// }

import { VideoJsPlayer } from 'video.js';

declare module 'video.js' {
    export interface VideoJsPlayer {
        mediacmsVjsPlugin: (
            domPlayer: HTMLVideoElement | HTMLAudioElement,
            options: mediacmsVjsPlugin.InputOptions,
            state: mediacmsVjsPlugin.InputState,
            resolutions: mediacmsVjsPlugin.InputResolutions,
            playbackSpeeds: mediacmsVjsPlugin.InputPlaybackSpeed[],
            stateUpdateCallback?: () => void,
            nextButtonClickCallback?: () => void,
            previousButtonClickCallback?: () => void
        ) => MediacmsVjsPlugin,
    }
}