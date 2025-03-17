import videojs, { VideoJsPlayer } from 'video.js';

import 'mediacms-videojs-icons/dist/mediacms-videojs-icons.css';
import './styles.scss';

import {
  browserSupports,
  filterInputOptions,
  filterVideoResolutions,
} from './utils/functions';

const VideoJsPlugin = videojs.getPlugin('plugin');

export class MediacmsVjsPlugin extends VideoJsPlugin {
  
  static VERSION: string;
  static defaultState: mediacmsVjsPlugin.State;

  state: any;
  setState: any;

  videoHtmlElem?: HTMLVideoElement | HTMLAudioElement;
  videoPreviewThumb?: mediacmsVjsPlugin.IVideoPreviewThumb;
  hasNext?: boolean;
  hasPrevious?: boolean;
  videoNativeDimensions?: boolean;
  enabledFullscreenToggle?: boolean;
  enabledTheaterMode?: boolean;
  subtitles?: mediacmsVjsPlugin.ISettingsSubtitles;
  playbackSpeeds?: mediacmsVjsPlugin.InputPlaybackSpeed[];
  videoResolutions?: mediacmsVjsPlugin.InputResolutions;

  updateTime?: number;
  updateTimeDiff?: number;
  pausedTime?: number;
  
  // seeking?: boolean;
  initedVideoPreviewThumb?: boolean;
  isChangingResolution?: boolean;
  wasPlayingOnResolutionChange?: boolean;
  hadStartedOnResolutionChange?: boolean;

  csstransforms?: boolean;
  progressBarLine: any;
  onBandwidthUpdate: any;
  onHlsRetryPlaylist: any;

  actionAnimElem: any;
  previousActionAnim?: any;

  constructor(
    player: VideoJsPlayer,
    domElem: HTMLVideoElement | HTMLAudioElement,
    options?: mediacmsVjsPlugin.InputOptions,
    // state?: Partial<mediacmsVjsPlugin.InputState>,
    resolutions?: mediacmsVjsPlugin.InputResolutions,
    // playbackSpeeds?: mediacmsVjsPlugin.InputPlaybackSpeed[],
    // stateUpdateCallback?: () => void,
    // nextButtonClickCallback?: () => void,
    // previousButtonClickCallback?: () => void
  ) {
    
    
    const prepareOptions = filterInputOptions(options);

    // if ( undefined === prepareOptions || undefined === prepareOptions.sources || ! prepareOptions.sources.length ) {
    //   console.warn("Missing media source");
    //   return;
    // }
    
    super(player, prepareOptions);
    
    this.videoHtmlElem = domElem;
    // this.subtitles = prepareOptions.subtitles;
    // this.videoPreviewThumb = prepareOptions.videoPreviewThumb;
    // this.hasNext = prepareOptions.controlBar ? prepareOptions.controlBar.next : false;
    // this.hasPrevious = prepareOptions.controlBar ? prepareOptions.controlBar.previous : false;
    this.videoNativeDimensions = undefined !== prepareOptions.nativeDimensions ? prepareOptions.nativeDimensions : false;
    // this.enabledTheaterMode = undefined !== prepareOptions.controlBar && undefined !== prepareOptions.controlBar.theaterMode ? prepareOptions.controlBar.theaterMode : true;
    // this.enabledFullscreenToggle = undefined !== prepareOptions.controlBar && undefined !== prepareOptions.controlBar.fullscreen ? prepareOptions.controlBar.fullscreen : true;
    // this.playbackSpeeds = filterPlaybackSpeeds(playbackSpeeds);
    this.videoResolutions = filterVideoResolutions(resolutions);

    this.updateTime = 0;
    this.updateTimeDiff = 0;
    this.pausedTime = -1;

    // this.seeking = false;
    // this.initedVideoPreviewThumb = false;
    this.isChangingResolution = false;
    this.wasPlayingOnResolutionChange = false;
    this.hadStartedOnResolutionChange = false;

    // this.seekingTimeout = null;
    // this.actionAnimationTimeout = null;
    // this.timeoutSettingsPanelFocusout = null;
    // this.timeoutSubtitlesPanelFocusout = null;
    // this.timeoutResolutionsPanelFocusout = null;
    // this.timeoutPlaybackSpeedsPanelFocusout = null;

    // this.stateUpdateCallback = 'function' === typeof stateUpdateCallback ? stateUpdateCallback : null;
    // this.nextButtonClickCallback = 'function' === typeof nextButtonClickCallback ? nextButtonClickCallback : null;
    // this.previousButtonClickCallback = 'function' === typeof previousButtonClickCallback ? previousButtonClickCallback : null;

    // this.csstransforms = browserSupports('csstransforms');
    // this.csstransforms = undefined !== this.csstransforms ? this.csstransforms : false;

    this.progressBarLine = null;
    this.onBandwidthUpdate = null;
    this.onHlsRetryPlaylist = null;

    // this.actionAnimElem = null;    
  }

  /* ----- Player events ----- */

  onTimeUpdateChange(){
    const ct = this.player.currentTime();
    this.updateTimeDiff = ct - ( undefined != this.updateTime ? this.updateTime : 0 );
    this.updateTime = ct;
  }
}
