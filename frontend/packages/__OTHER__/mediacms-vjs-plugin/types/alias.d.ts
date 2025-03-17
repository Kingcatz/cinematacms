declare namespace mediacmsVjsPlugin {
    type VideoMimeType = 'application/x-mpegURL';   // TODO: Make improvements....
    type VideoFormat = 'hls' | 'vp9' | 'h264';
    type VideoResolution = 240 | 360 | 480 | 720 | 1080 | 'Auto';
    type VideoPlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
}