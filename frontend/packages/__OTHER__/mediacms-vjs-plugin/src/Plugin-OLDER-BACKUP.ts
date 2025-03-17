import videojs, { VideoJsPlayer } from 'video.js';

import 'mediacms-videojs-icons/dist/mediacms-videojs-icons.css';
import './styles.scss';

import {
  browserSupports,
  filterInputOptions,
  filterInputState,
  filterVideoResolutions,
  filterPlaybackSpeeds,
  initialResolutionFilter,
  applyCssTransform,
  centralizeBoxPosition,
  initElementsFocus,
  videoPreviewSpriteThumbs,
} from './utils/functions';

import {
  setComponents,
} from './utils/setComponents';

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

  // seekingTimeout?: NodeJS.Timeout | null;
  actionAnimationTimeout?: NodeJS.Timeout | null;
  timeoutSettingsPanelFocusout?: NodeJS.Timeout | null;
  timeoutSubtitlesPanelFocusout?: NodeJS.Timeout | null;
  timeoutResolutionsPanelFocusout?: NodeJS.Timeout | null;
  timeoutPlaybackSpeedsPanelFocusout?: NodeJS.Timeout | null;
  
  // stateUpdateCallback?: ((publicState: Object) => void) | null;
  nextButtonClickCallback?: (() => void) | null;
  previousButtonClickCallback?: (() => void) | null;

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
    state?: Partial<mediacmsVjsPlugin.InputState>,
    resolutions?: mediacmsVjsPlugin.InputResolutions,
    playbackSpeeds?: mediacmsVjsPlugin.InputPlaybackSpeed[],
    stateUpdateCallback?: () => void,
    nextButtonClickCallback?: () => void,
    previousButtonClickCallback?: () => void
  ) {
    
    
    const prepareOptions = filterInputOptions(options);

    if ( undefined === prepareOptions || undefined === prepareOptions.sources || ! prepareOptions.sources.length ) {
      console.warn("Missing media source");
      return;
    }
    
    super(player, prepareOptions);
    
    this.videoHtmlElem = domElem;
    this.subtitles = prepareOptions.subtitles;
    this.videoPreviewThumb = prepareOptions.videoPreviewThumb;
    this.hasNext = prepareOptions.controlBar ? prepareOptions.controlBar.next : false;
    this.hasPrevious = prepareOptions.controlBar ? prepareOptions.controlBar.previous : false;
    this.videoNativeDimensions = undefined !== prepareOptions.nativeDimensions ? prepareOptions.nativeDimensions : false;
    this.enabledTheaterMode = undefined !== prepareOptions.controlBar && undefined !== prepareOptions.controlBar.theaterMode ? prepareOptions.controlBar.theaterMode : true;
    this.enabledFullscreenToggle = undefined !== prepareOptions.controlBar && undefined !== prepareOptions.controlBar.fullscreen ? prepareOptions.controlBar.fullscreen : true;
    this.playbackSpeeds = filterPlaybackSpeeds(playbackSpeeds);
    this.videoResolutions = filterVideoResolutions(resolutions);

    this.updateTime = 0;
    this.updateTimeDiff = 0;
    this.pausedTime = -1;

    // this.seeking = false;
    this.initedVideoPreviewThumb = false;
    this.isChangingResolution = false;
    this.wasPlayingOnResolutionChange = false;
    this.hadStartedOnResolutionChange = false;

    // this.seekingTimeout = null;
    this.actionAnimationTimeout = null;
    this.timeoutSettingsPanelFocusout = null;
    this.timeoutSubtitlesPanelFocusout = null;
    this.timeoutResolutionsPanelFocusout = null;
    this.timeoutPlaybackSpeedsPanelFocusout = null;

    // this.stateUpdateCallback = 'function' === typeof stateUpdateCallback ? stateUpdateCallback : null;
    this.nextButtonClickCallback = 'function' === typeof nextButtonClickCallback ? nextButtonClickCallback : null;
    this.previousButtonClickCallback = 'function' === typeof previousButtonClickCallback ? previousButtonClickCallback : null;

    this.csstransforms = browserSupports('csstransforms');
    this.csstransforms = undefined !== this.csstransforms ? this.csstransforms : false;

    this.progressBarLine = null;
    this.onBandwidthUpdate = null;
    this.onHlsRetryPlaylist = null;

    this.actionAnimElem = null;
    
    // const prepareState = {...this.state,...filterInputState(state)};
    
    // const {
    //   initialResolution,
    //   resolutionOrder,
    //   resolutionFormat
    // } = initialResolutionFilter(player.src(), prepareState.theSelectedQuality, this.videoResolutions);

    // prepareState.theSelectedQuality = initialResolution;

    // prepareOptions.resolutions = { default: initialResolution, options: this.videoResolutions };
    // prepareOptions.playbackSpeeds = { default: prepareState.theSelectedPlaybackSpeed, options: this.playbackSpeeds };
    // prepareOptions.enabledTouchControls = videojs.browser.TOUCH_ENABLED || prepareOptions.enabledTouchControls;

    // setComponents( player, prepareOptions );

    // this.setState( prepareState );
    
    // player.addClass('vjs-mediacms-plugin');
    // player.addClass('vjs-loading-video');

    // if (this.videoNativeDimensions) {
    //     player.addClass('vjs-native-dimensions');
    // }

    // if (prepareOptions.enabledTouchControls) {
    //     player.addClass('vjs-enabled-touch-controls');
    // }

    // this.onPlayerReady = this.onPlayerReady.bind(this);

    // this.onError = this.onError.bind(this);

    // if (prepareOptions.keyboardControls) {
    //   this.initKeyboardEvents( <HTMLElement>player.el() );
    // }

    // this.initPlayerEvents();
    // this.initControlsEvents();

    this.initEvents();    

    // this.player.ready(this.onPlayerReady);
    
    this.initPlayerEvents_OLDER();

    // initElementsFocus(player);
  }

  initEvents(){
    this.on('statechanged', this.onStateChange);
  }

  // initKeyboardEvents(playerElement: HTMLElement){
  //   playerElement.onkeyup = this.onKeyUp.bind(this);
  //   playerElement.onkeydown = this.onKeyDown.bind(this);
  // }

  // initPlayerEvents(){
  //   this.on(this.player, ['error'], this.onError);
  //   this.on(this.player, ['playing','pause'], this.onPlayToggle);
  //   this.on(this.player, ['ended'], this.onEnded);
  //   this.on(this.player, ['seeked'], this.onSeeked);
  //   this.on(this.player, ['seeking'], this.onSeeking);
  //   this.on(this.player, ['moveforward'], this.onMoveForward);
  //   this.on(this.player, ['movebackward'], this.onMoveBackward);
  //   this.on(this.player, ['volumechange'], this.onVolumeChange);
  //   this.on(this.player, ['timeupdate'], this.onTimeUpdateChange);
  // }

  // initControlsEvents(){
  //   this.on(this.player, ['theatermodechange'], this.onTheaterModeChange);
  //   this.on(this.player, ['fullscreenchange'], this.onFullscreenChange);
  // }
    
  initPlayerEvents_OLDER(){

    /* ------------------------- */
    /* ------------------------- */    
    /* ------------------------- */    
    /* ------------------------- */    
    /* ------------------------- */

    /*TODO: Make improvements based on 'dispose' result.*/
    // this.on(this.player, ['dispose'], this.onDispose);
    
    // this.on(this.player, ['userinactive'], this.onUserInactive);
    
    // this.on(this.player, ['selectedQuality'], this.onQualitySelection);
    this.on(this.player, ['selectedSubtitleOption'], this.onSubtitleOptionSelection);
    // this.on(this.player, ['selectedPlaybackSpeed'], this.onPlaybackSpeedSelection);

    this.on(this.player, ['focusoutSettingsPanel'], this.onFocusOutSettingsPanel);
    this.on(this.player, ['focusoutSubtitlesPanel'], this.onFocusOutSubtitlesPanel);
    this.on(this.player, ['focusoutResolutionsPanel'], this.onFocusOutResolutionsPanel);
    this.on(this.player, ['focusoutPlaybackSpeedsPanel'], this.onFocusOutPlaybackSpeedsPanel);

    // if (this.hasNext ) {
    //   this.on(this.player, ['clicked_next_button'], this.onNextButtonClick);
    // }

    // if (this.hasPrevious ) {
    //   this.on(this.player, ['clicked_previous_button'], this.onPreviousButtonClick);
    // }

    this.on(this.player, ['openSettingsPanel'], this.openSettingsOptions);
    this.on(this.player, ['closeSettingsPanel'], this.closeSettingsOptions);

    this.on(this.player, ['openSubtitlesPanel'], this.openSubtitlesOptions);
    this.on(this.player, ['closeSubtitlesPanel'], this.closeSubtitlesOptions);

    // this.on(this.player, ['openQualityOptions'], this.openQualityOptions);
    // this.on(this.player, ['closeQualityOptions'], this.closeQualityOptions);

    // this.on(this.player, ['openPlaybackSpeedOptions'], this.openPlaybackSpeedOptions);
    // this.on(this.player, ['closePlaybackSpeedOptions'], this.closePlaybackSpeedOptions);
  }

  /* ----- Keyboard events ----- */

  // onKeyUp(e: { keyCode: any; charCode: any; shiftKey: any; preventDefault: () => void; stopPropagation: () => void; }){
  
  //   if (this.player.ended()) {
  //     // @todo: Should be better to unbind listeners on ended ...? Maybe not ...?
  //     return;
  //   }

  //   const key = e.keyCode || e.charCode;
    
  //   let found = false;

  //   if (e.shiftKey) {
  //     switch (key) {
  //       case 78: // Next media [ shift + n ].
  //         this.onNextButtonClick();
  //         break;
  //       case 80: // Previous media [ shift + p ].
  //         this.onPreviousButtonClick();
  //         break;
  //     }
  //   } else if ((48 <= key && 57 >= key) || (96 <= key && 105 >= key)) { // Numbers from 0 to 9.
  //     this.player.currentTime(0.1 * (57 < key ? key - 96 : key - 48) * this.player.duration());
  //     this.player.trigger({ type: 'timeupdate', target: this, manuallyTriggered: true });
  //   } else {
  //     switch (key) {
  //       case 75: // Play/Pause [k].
  //         this.player[this.player.paused() ? 'play' : 'pause']();
  //         found = true;
  //         break;
  //       case 70: // Enter - exit fullscreen mode [f].
  //         if (this.enabledFullscreenToggle) {
  //           if (this.player.isFullscreen()) {
  //             this.player.exitFullscreen();
  //           } else {
  //             this.player.requestFullscreen();
  //           }
  //           found = true;
  //         }
  //         break;
  //       case 77: // Mute - unmute sound [m].
  //         this.player.muted(!this.player.muted());
  //         found = true;
  //         break;
  //       case 84: // Enable - disable theater mode [t].
  //         if (this.enabledTheaterMode) {

  //           if (this.player.isFullscreen()) {
  //             this.player.exitFullscreen();
  //           }

  //           this.player.trigger('theatermodechange');
  //         }
  //         break;
  //     }
  //   }

  //   if (found) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // }

  // onKeyDown(e: { keyCode: any; charCode: any; preventDefault: () => void; stopPropagation: () => void; }){
    
  //   if (this.player.ended()) {
  //     // @todo: Should be better to unbind listeners on ended ...? Maybe not ...?
  //     return;
  //   }

  //   const key = e.keyCode || e.charCode;
  //   let found = false;

  //   switch (key) {
  //     case 32: // Play/Pause [Space].
  //       this.player[this.player.paused() ? 'play' : 'pause']();
  //       found = true;
  //       break;
  //     case 37: // Move backward [Arrow Left].
  //       this.player.currentTime(this.player.currentTime() - (5 * this.state.theSelectedPlaybackSpeed));
  //       this.player.trigger('movebackward');
  //       found = true;
  //       break;
  //     case 38: // Volume Up [Arrow Up].
  //       if (this.player.muted()) {
  //         this.player.muted(false);
  //       } else {
  //         this.player.volume(Math.min(1, this.player.volume() + 0.03));
  //       }
  //       found = true;
  //       break;
  //     case 39: // Move forward [Arrow Right].
  //       this.player.currentTime(this.player.currentTime() + (5 * this.state.theSelectedPlaybackSpeed));
  //       this.player.trigger('moveforward');
  //       found = true;
  //       break;
  //     case 40: // Volume Down [Arrow Down].
  //       this.player.volume(Math.max(0, this.player.volume() - 0.03));
  //       found = true;
  //       break;
  //   }

  //   if (found) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }    
  // }

  /* ----- Player events ----- */

  // onError(){
  //   if (!this.player.paused()) {
  //     this.player.pause();
  //   }
  //   this.player.reset();
  // }

  // onPlayToggle(e: Event){

  //   const playing = "playing" === e.type;

  //   if (!this.seeking && ( undefined === this.updateTimeDiff || 1 > Math.abs(this.updateTimeDiff) ) ) {
  //     this.actionAnimation(!playing ? 'pause' : 'play');
  //   }

  //   this.setState({
  //     playing: playing,
  //   });
  // }
  
  // onEnded() {
  //   this.setState({ ended: true });
  // }

  // onSeeked(){
  //   this.seekingTimeout = setTimeout(function(ins) { ins.seeking = false }, 300, this);
  // }

  // onSeeking(){

  //   if( this.seekingTimeout ){
  //     clearTimeout(this.seekingTimeout);
  //   }

  //   this.seeking = true;
    
  //   if (this.progressBarLine) {
  //     this.progressBarLine.style.width = ((100 * this.player.currentTime()) / this.player.duration()).toFixed(2) + '%';
  //   }
  // }

  // onMoveForward() {
  //   this.actionAnimation('forward');
  // }

  // onMoveBackward() {
  //   this.actionAnimation('backward');
  // }

  // onVolumeChange(){
  //   this.setState({
  //     volume: this.player.volume(),
  //     soundMuted: this.player.muted()
  //   });
  //   this.actionAnimation('volume');
  // }

  onTimeUpdateChange(){
    const ct = this.player.currentTime();
    this.updateTimeDiff = ct - ( undefined != this.updateTime ? this.updateTime : 0 );
    this.updateTime = ct;
  }

  /* ----- Controls events ----- */
  
  // onTheaterModeChange(){
  //   this.setState({ theaterMode: !this.state.theaterMode  });
  // }

  onFullscreenChange(){
    
    // this.player.addClass('vjs-fullscreen-change');
    
    // setTimeout(function(plr) {
    //   plr.removeClass('vjs-fullscreen-change');
    // }, 100, this.player);

    this.updateVideoElementPosition();
  }
  
  /* ------------------------- */
  /* ------------------------- */
  /* ------------------------- */
  /* ------------------------- */
  /* ------------------------- */

  onWindowResize() {
    this.updateVideoPlayerRatios();
  }

  // onDispose(){
  //   window.removeEventListener('resize', this.onWindowResize);
  // }

  // initDomEvents() {

  //   this.onWindowResize = this.onWindowResize.bind(this);

  //   window.addEventListener('resize', this.onWindowResize);
    
  //   if( this.videoHtmlElem ){
  //     this.videoHtmlElem.onloadeddata = this.onVideoDataLoad.bind(this);
  //   }

  //   // Video has already loaded.
  //   if (this.videoHtmlElem && 4 === this.videoHtmlElem.readyState) {
  //     this.onVideoDataLoad();
  //   }
  // }

  onVideoDataLoad() {

    // this.player.removeClass('vjs-loading-video');

    if (this.videoPreviewThumb && !this.initedVideoPreviewThumb) {
      this.initedVideoPreviewThumb = true;
      videoPreviewSpriteThumbs(this.player, this.videoPreviewThumb);
    }

    // TODO: Continue here...

    // if ('Auto' === this.state.theSelectedQuality || 'auto' === this.state.theSelectedQuality ) {

    //   if (!!this.player.tech_.hls && null === this.onBandwidthUpdate) {

    //     this.onBandwidthUpdate = this.onBandwidthUpdateCallback.bind(this);
    //     this.player.tech_.on('bandwidthupdate', this.onBandwidthUpdate);

    //     this.onBandwidthUpdateCallback();
    //   }
    // } else {

    //   if (null !== this.onBandwidthUpdate) {
    //     this.player.tech_.off('bandwidthupdate', this.onBandwidthUpdate);
    //     this.onBandwidthUpdate = null;
    //   }

    //   if (!!this.player.tech_.hls && null === this.onHlsRetryPlaylist) {
    //     // @note: Catch invalid playlists when selected resolution is not "Auto".
    //     this.onHlsRetryPlaylist = this.onHlsRetryPlaylistCallback.bind(this);
    //     this.player.tech_.on('retryplaylist', this.onHlsRetryPlaylist);
    //   }
    // }

    if (this.isChangingResolution) {

      if (this.hadStartedOnResolutionChange) {
        this.player.hasStarted(true);
        this.player.removeClass('vjs-changing-resolution');
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

  // actionAnimation(action: 'play' | 'pause' | 'backward' | 'forward' | 'volume' | 'play_previous' | 'play_next' ) {

  //   if (!this.player.hasStarted()) {
  //     return;
  //   }

  //   const playerElement = this.player.el();

  //   this.actionAnimElem = this.actionAnimElem || playerElement.querySelector('.vjs-actions-anim');

  //   if (!this.actionAnimElem) {
  //     return;
  //   }

  //   let cls: string = '';

  //   switch (action) {
  //     case 'play':
  //       if (void 0 !== this.previousActionAnim && 'forward' !== this.previousActionAnim && 'backward' !== this.previousActionAnim) {
  //         cls = 'started-playing';
  //       }
  //       break;
  //     case 'pause':
  //       cls = 'just-paused';
  //       break;
  //     case 'backward':
  //       cls = 'moving-backward';
  //       break;
  //     case 'forward':
  //       cls = 'moving-forward';
  //       break;
  //     case 'volume':
  //       if (this.player.muted() || 0.001 >= this.player.volume()) {
  //         cls = 'volume-mute';
  //       } else if (0.33 >= this.player.volume()) {
  //         cls = 'volume-low';
  //       } else if (0.69 >= this.player.volume()) {
  //         cls = 'volume-mid';
  //       } else {
  //         cls = 'volume-high';
  //       }
  //       break;
  //     case 'play_previous':
  //       cls = 'play_previous';
  //       break;
  //     case 'play_next':
  //       cls = 'play_next';
  //       break;
  //   }

  //   if (!cls) {
  //     return;
  //   }

  //   if (this.actionAnimationTimeout) {
  //     this.actionAnimElem.setAttribute('class', 'vjs-actions-anim');
  //   }

  //   setTimeout(function(instance) {

  //     instance.previousActionAnim = action;

  //     cls += ' active-anim';

  //     clearTimeout(instance.actionAnimationTimeout);

  //     instance.actionAnimElem.setAttribute('class', 'vjs-actions-anim ' + cls);

  //     instance.actionAnimationTimeout = setTimeout(function(ins) {

  //       ins.actionAnimElem.setAttribute('class', 'vjs-actions-anim');
  //       ins.actionAnimationTimeout = null;
  //       ins.previousActionAnim = null;

  //     }, 750, instance);

  //   }, this.actionAnimationTimeout ? 20 : 0, this);
  // }

  // updateTheaterModeClassname() {
  //   this.player[this.state.theaterMode ? 'addClass' : 'removeClass']('vjs-theater-mode');
  // }

  updateVideoElementPosition() {

    if (this.videoHtmlElem) {

      if (this.videoNativeDimensions) {

        const playerElement = <HTMLElement>this.player.el();

        const newval = centralizeBoxPosition(
          this.videoHtmlElem.offsetWidth,
          this.videoHtmlElem.offsetHeight,
          this.state.videoRatio,
          playerElement.offsetWidth,
          playerElement.offsetHeight,
          this.state.playerRatio
        );

        // @note: Don't need because we are set in CSS the properties "max-width:100%;" and "max-height:100%;" of <video> element and wont exceed available player space.
        /* this.videoHtmlElem.style.width = newval.w + 'px';
        this.videoHtmlElem.style.height = newval.h + 'px';*/

        if (this.csstransforms) {
          applyCssTransform(this.videoHtmlElem, 'translate(' + (newval.l > 0 ? newval.l : '0') + 'px,' + (newval.t > 0 ? newval.t : '0') + 'px)');
        } else {
          this.videoHtmlElem.style.top = newval.t > 0 ? newval.t + 'px' : '';
          this.videoHtmlElem.style.left = newval.l > 0 ? newval.l + 'px' : '';
        }

      } else {

      }
    }
  }

  updateVideoPlayerRatios() {

    const playerElement = <HTMLElement>this.player.el();

    if( this.videoHtmlElem ){
      this.setState({
        videoRatio: this.videoHtmlElem.offsetWidth / this.videoHtmlElem.offsetHeight,
        playerRatio: playerElement.offsetWidth / playerElement.offsetHeight
      });

      let settingsPanelInner = document.querySelectorAll('.vjs-settings-panel-inner');

      if (settingsPanelInner.length) {
        var i = 0;
        while (i < settingsPanelInner.length) {
          (<HTMLElement>settingsPanelInner[i]).style.maxHeight = (this.videoHtmlElem.offsetHeight - 120) + "px";
          i += 1;
        }
      }
    }
  }

  selectedPlaybackSpeedTitle() {
    const playbackSpeed = undefined === this.playbackSpeeds ? this.playbackSpeeds : this.playbackSpeeds.find( (ps: mediacmsVjsPlugin.InputPlaybackSpeed) => this.state.theSelectedPlaybackSpeed === ps.speed );
    return undefined !== playbackSpeed ? playbackSpeed.title :  'n/a';
  }

  // TODO: Recheck its usage.
  selectedQualityTitle() {
    return this.state.theSelectedQuality + ("Auto" === this.state.theSelectedQuality && null !== this.state.theSelectedAutoQuality ? "&nbsp;<span class='auto-resolution-title'>" + this.state.theSelectedAutoQuality + "</span>" : "");
  }

  /* Events Handlers */
  
  // handleStateChanged(e: Event): void{
  // }

  onStateChange(d: {'changes': any}) {

    if (d.changes.videoRatio || d.changes.playerRatio) {
      this.updateVideoElementPosition();
    }

    // if (d.changes.volume) {
    //   this.onPublicStateUpdate();
    // }

    // if (d.changes.soundMuted) {
    //   this.onPublicStateUpdate();
    // }

    // if (d.changes.theaterMode) {
    //   this.onPublicStateUpdate();
    // }

    if (d.changes.theaterMode) {

      // this.updateTheaterModeClassname();

      // @note: Need this delay to allow complete function 'updateTheaterModeClassname'.
      setTimeout(function(ins) {
        ins.updateVideoPlayerRatios();
      }, 20, this);
    }

    // if (d.changes.isOpenSettingsOptions) {

    // }

    // if (d.changes.isOpenQualityOptions) {

    // }

    // if (d.changes.isOpenPlaybackSpeedOptions) {

    // }

    if (d.changes.theSelectedSubtitleOption) {
      this.changeVideoSubtitle();
      this.player.trigger('updatedSelectedSubtitleOption');
      this.onPublicStateUpdate();
    }

    if (d.changes.theSelectedQuality) {
      this.changeVideoResolution();
      this.player.trigger('updatedSelectedQuality');
      this.onPublicStateUpdate();
    }

    if (d.changes.theSelectedPlaybackSpeed) {
      this.changePlaybackSpeed();
      this.player.trigger('updatedSelectedPlaybackSpeed');
      this.onPublicStateUpdate();
    }

    // if (d.changes.isOpenSettingsOptions || d.changes.isOpenQualityOptions || d.changes.theSelectedQuality || d.changes.isOpenPlaybackSpeedOptions || d.changes.theSelectedPlaybackSpeed) {
    //   this.player.trigger('updatedSettingsPanelsVisibility');
    // }

    // if (d.changes.isOpenSubtitlesOptions) {
    //   this.player.trigger('updatedSubtitlesPanelsVisibility');
    // }

    // if (d.changes.openSettings) {
    //   if (this.state.openSettings) {
    //     this.player.trigger('openedSettingsPanel', this.state.openSettingsFromKeyboard);
    //   }
    // }

    // if (d.changes.closeSettings) {
    //   if (this.state.closeSettings) {
    //     this.player.trigger('closedSettingsPanel', this.state.closeSettingsFromKeyboard);
    //   }
    // }

    // if (d.changes.openSubtitles) {
    //   if (this.state.openSubtitles) {
    //     this.player.trigger('openedSubtitlesPanel', this.state.openSubtitlesFromKeyboard);
    //   }
    // }

    // if (d.changes.closeSubtitles) {
    //   if (this.state.closeSubtitles) {
    //     this.player.trigger('closedSubtitlesPanel', this.state.closeSubtitlesFromKeyboard);
    //   }
    // }

    // if (d.changes.openQualities) {
    //   if (this.state.openQualities) {
    //     this.player.trigger('openedQualities', this.state.openQualitiesFromKeyboard);
    //   }
    // }

    // if (d.changes.closeQualities) {
    //   if (this.state.closeQualities) {
    //     this.player.trigger('closedQualities', this.state.closeQualitiesFromKeyboard);
    //   }
    // }

    // if (d.changes.openPlaybackSpeeds) {
    //   if (this.state.openPlaybackSpeeds) {
    //     this.player.trigger('openedPlaybackSpeeds', this.state.openPlaybackSpeedsFromKeyboard);
    //   }
    // }

    // if (d.changes.closePlaybackSpeeds) {
    //   if (this.state.closePlaybackSpeeds) {
    //     this.player.trigger('closedPlaybackSpeeds', this.state.closePlaybackSpeedsFromKeyboard);
    //   }
    // }
  }
        
  changeVideoSubtitle() {

    // console.log( this.player.textTracks() );
    // console.log( this.player.textTrackDisplay );
    // console.log( this.player.textTrackSettings );

    if ('off' !== this.state.theSelectedSubtitleOption) {
      this.player.removeClass('vjs-subtitles-off');
      this.player.addClass('vjs-subtitles-on')
    } else {
      this.player.removeClass('vjs-subtitles-on');
      this.player.addClass('vjs-subtitles-off');
    }

    const tracks = this.player.textTracks();

    for (let i = 0; i < tracks.length; i++) {

      // console.log( tracks[i].kind, tracks[i].language, tracks[i].label );

      if ('subtitles' === tracks[i].kind) {
        tracks[i].mode = this.state.theSelectedSubtitleOption === tracks[i].language ? 'showing' : 'hidden';
        // console.log( tracks[i].mode );
      }
    }
  }

  changeVideoResolution() {

    this.isChangingResolution = true;

    const sources = [];
    const currentTime = this.player.currentTime();
    const duration = this.player.duration();

    this.wasPlayingOnResolutionChange = !this.player.paused();
    this.hadStartedOnResolutionChange = this.player.hasStarted();

    if (this.hadStartedOnResolutionChange) {
      this.player.addClass('vjs-changing-resolution');
    }

    /*if( this.wasPlayingOnResolutionChange ){
      this.player.pause();
    }*/

    if( this.videoResolutions ){
      let i = 0;
      while (i < this.videoResolutions[this.state.theSelectedQuality].src.length) {
        sources.push({ src: this.videoResolutions[this.state.theSelectedQuality].src[i] });
        i += 1;
      }
    }

    this.player.src(sources); // @note: Load all sources (with provided order).
    this.player.reset();
    this.player.currentTime(currentTime);
    this.player.duration(duration);
    this.player.playbackRate(this.state.theSelectedPlaybackSpeed);
  }

  changePlaybackSpeed() {
    this.player.playbackRate(this.state.theSelectedPlaybackSpeed);
  }

  onPublicStateUpdate() {

  //   if (this.stateUpdateCallback) {
      
  //     this.stateUpdateCallback({
  //       volume: this.state.volume,
  //       theaterMode: this.state.theaterMode,
  //       soundMuted: this.state.soundMuted,
  //       quality: this.state.theSelectedQuality,
  //       playbackSpeed: this.state.theSelectedPlaybackSpeed,
  //       subtitle: this.state.theSelectedSubtitleOption,
  //     });
  //   }
  }

  onPlayerReady(){

    // this.player.addClass('vjs-mediacms-plugin');

    // const playerElement = this.player.el();

    // this.progressBarLine = playerElement.querySelector('.video-js .vjs-progress-holder .vjs-play-progress');

    // TODO: Enable these

    /*// console.log( this.player.textTracks(), this.subtitles );

    if (null !== this.subtitles) {

      const subtitleLanguages = [];
      let i;
      let track;
      let tracks = this.player.textTracks();

      for (i = 0; i < tracks.length; i++) {
        subtitleLanguages.push(tracks[i].language);
      }

      i = 1; // Exclude 'off' language option.
      while (i < this.subtitles.languages.length) {

        if (-1 === subtitleLanguages.indexOf(this.subtitles.languages[i].srclang)) {

          // console.log('-A-');

          this.player.addRemoteTextTrack({
            kind: 'subtitles',
            label: this.subtitles.languages[i].label,
            language: this.subtitles.languages[i].srclang,
            src: this.subtitles.languages[i].src,
          });
        }
        i += 1;
      }
    }

    // console.log( this.player.textTracks() );
    // console.log( this.player.remoteTextTracks() );

    // this.changeVideoSubtitle();*/

    // this.initDomEvents();

    // this.player.volume(this.state.volume);
    // this.player.muted(this.state.soundMuted);
    // this.player.playbackRate(this.state.theSelectedPlaybackSpeed);
    
    // this.player.addClass('vjs-mediacms-plugin');
    
    // this.updateTheaterModeClassname();

    // Trigger states changes, if need.

    setTimeout(function(ins) {
      ins.updateVideoPlayerRatios();
    }, 100, this);
  }

  /* Player Events Handlers */

  onUserInactive(){
    if (this.state.isOpenQualityOptions || this.state.isOpenPlaybackSpeedOptions || this.state.isOpenSettingsOptions) {
      this.player.trigger('closeSettingsPanel');
    }
  }

  // onQualitySelection(e: Event, newQuality: string){
  //   this.setState({
  //     isOpenSettingsOptions: false,
  //     isOpenQualityOptions: false,
  //     theSelectedQuality: newQuality
  //   });
  // }

  onSubtitleOptionSelection(e: Event, newSelection: string) {
    this.setState({
      isOpenSubtitlesOptions: false,
      theSelectedSubtitleOption: newSelection
    });
  }

  // onPlaybackSpeedSelection(e: Event, newPlaybackSpeed: string){
  //   this.setState({
  //     isOpenSettingsOptions: false,
  //     isOpenPlaybackSpeedOptions: false,
  //     theSelectedPlaybackSpeed: newPlaybackSpeed,
  //   });
  // }

  onFocusOutSettingsPanel() {

    if (this.timeoutSettingsPanelFocusout) {
      return;
    }

    if (!this.state.isOpenQualityOptions && !this.state.isOpenPlaybackSpeedOptions) {
      this.player.focus();
    }

    if (!this.state.isOpenQualityOptions) {
      this.timeoutSettingsPanelFocusout = setTimeout(function(ins) {
        if (ins.state.isOpenSettingsOptions && !ins.state.isOpenQualityOptions) {
          ins.setState({
            isOpenSettingsOptions: !1,
          });
        }
        ins.timeoutSettingsPanelFocusout = null;
      }, 100, this);
    } else if (!this.state.isOpenPlaybackSpeedOptions) {
      this.timeoutSettingsPanelFocusout = setTimeout(function(ins) {
        if (ins.state.isOpenSettingsOptions && !ins.state.isOpenPlaybackSpeedOptions) {
          ins.setState({
            isOpenSettingsOptions: !1,
          });
        }
        ins.timeoutSettingsPanelFocusout = null;
      }, 100, this);
    }
  }

  onFocusOutSubtitlesPanel() {

    if (this.timeoutSubtitlesPanelFocusout) {
      return;
    }

    this.player.focus(); // TODO: Remove all this kind of focus(es). Before removal, test the players in MediaCMS, while the window has scrolled down.

    this.timeoutSubtitlesPanelFocusout = setTimeout(function(ins) {

      ins.setState({
        isOpenSubtitlesOptions: !1,
      });

      ins.timeoutSubtitlesPanelFocusout = null;
    }, 100, this);
  }

  onFocusOutResolutionsPanel() {

    if (this.timeoutResolutionsPanelFocusout) {
      return;
    }

    if (!this.state.isOpenSettingsOptions && !this.state.isOpenPlaybackSpeedOptions) {
      this.player.focus();
    }

    if (!this.state.isOpenSettingsOptions) {
      this.timeoutResolutionsPanelFocusout = setTimeout(function(ins) {
        if (ins.state.isOpenQualityOptions && !ins.state.isOpenSettingsOptions) {
          ins.setState({
            isOpenQualityOptions: !1
          });
        }
        ins.timeoutResolutionsPanelFocusout = null;
      }, 100, this);
    }
  }

  onFocusOutPlaybackSpeedsPanel() {

    if (this.timeoutPlaybackSpeedsPanelFocusout) {
      return;
    }

    if (!this.state.isOpenQualityOptions && !this.state.isOpenSettingsOptions) {
      this.player.focus();
    }

    if (!this.state.isOpenSettingsOptions) {
      this.timeoutPlaybackSpeedsPanelFocusout = setTimeout(function(ins) {
        if (ins.state.isOpenPlaybackSpeedOptions && !ins.state.isOpenSettingsOptions) {
          ins.setState({
            isOpenPlaybackSpeedOptions: !1
          });
        }
        ins.timeoutPlaybackSpeedsPanelFocusout = null;
      }, 100, this);
    }
  }
  
  onNextButtonClick(){
    if (this.hasNext) {
      // this.actionAnimation('play_next');
      if (this.nextButtonClickCallback) {
        this.nextButtonClickCallback();
      }
    }
  }
  
  onPreviousButtonClick(){
    if (this.hasPrevious) {
      // this.actionAnimation('play_previous');
      if (this.previousButtonClickCallback) {
        this.previousButtonClickCallback();
      }
    }
  }

  onBandwidthUpdateCallback(ev: Event) {

    // TODO: Continue here...

    // this.onAutoQualitySelection(this.player.tech_.hls.playlists.media_.attributes.RESOLUTION.height);
  }

  onHlsRetryPlaylistCallback(ev: Event) {

    // TODO: Continue here...

    // if ("Auto" !== this.state.theSelectedQuality && void 0 !== this.videoResolutions["Auto"]) {
    //   this.setState({
    //     theSelectedQuality: "Auto"
    //   });
    // }
  }

  onAutoQualitySelection(newAutoQuality: any) {

    if (newAutoQuality !== this.state.theSelectedAutoQuality) {

      this.setState({
        theSelectedAutoQuality: newAutoQuality,
      });

      this.player.trigger('updatedSelectedQuality');
    }
  }
  
  openSettingsOptions(e: Event, triggeredFromKeyboard: boolean = false){

    if(this.timeoutSettingsPanelFocusout){
      clearTimeout(this.timeoutSettingsPanelFocusout);
    }
    
    // this.setState({
    //   openSettings: new Date(),
    //   openSettingsFromKeyboard: triggeredFromKeyboard ? new Date() : false,
    //   isOpenSettingsOptions: true,
    //   isOpenQualityOptions: false,
    //   isOpenPlaybackSpeedOptions: false,
    //   isOpenSubtitlesOptions: false,
    // });
  }
  
  closeSettingsOptions(e: Event, triggeredFromKeyboard: boolean = false){

    if(this.timeoutSettingsPanelFocusout){
      clearTimeout(this.timeoutSettingsPanelFocusout);
    }

    // this.setState({
    //   closeSettings: new Date(),
    //   closeSettingsFromKeyboard: triggeredFromKeyboard ? new Date() : false,
    //   isOpenSettingsOptions: false,
    //   isOpenQualityOptions: false,
    //   isOpenPlaybackSpeedOptions: false,
    // });
  }

  openSubtitlesOptions(e: Event, triggeredFromKeyboard: boolean = false){
    
    if(this.timeoutSubtitlesPanelFocusout){
   
      clearTimeout(this.timeoutSubtitlesPanelFocusout);

      // this.setState({
      //   openSubtitles: new Date(),
      //   openSubtitlesFromKeyboard: triggeredFromKeyboard ? new Date() : false,
      //   isOpenSubtitlesOptions: true,
      //   isOpenSettingsOptions: false,
      //   isOpenQualityOptions: false,
      //   isOpenPlaybackSpeedOptions: false,
      // });
    }
  }

  closeSubtitlesOptions(e: Event, triggeredFromKeyboard: boolean = false){

    if(this.timeoutSubtitlesPanelFocusout){
   
      clearTimeout(this.timeoutSubtitlesPanelFocusout);

      // this.setState({
      //   closeSubtitles: new Date(),
      //   closeSubtitlesFromKeyboard: triggeredFromKeyboard ? new Date() : false,
      //   isOpenSubtitlesOptions: false,
      // });
    }
  }
  
  // openQualityOptions(e: Event, triggeredFromKeyboard: boolean = false){
    
  //   if(this.timeoutResolutionsPanelFocusout){
  //     clearTimeout(this.timeoutResolutionsPanelFocusout);
  //   }

  //   // this.setState({
  //   //   openQualities: new Date(),
  //   //   openQualitiesFromKeyboard: triggeredFromKeyboard ? new Date() : false,
  //   //   isOpenSettingsOptions: false,
  //   //   isOpenQualityOptions: true,
  //   // });
  // }
  
  // closeQualityOptions(e: Event, triggeredFromKeyboard: boolean = false){
    
  //   if(this.timeoutResolutionsPanelFocusout){
  //     clearTimeout(this.timeoutResolutionsPanelFocusout);
  //   }

  //   this.setState({
  //     closeQualities: new Date(),
  //     closeQualitiesFromKeyboard: triggeredFromKeyboard ? new Date() : false,
  //     openSettings: new Date(),
  //     openSettingsFromKeyboard: triggeredFromKeyboard ? new Date() : false,
  //     isOpenSettingsOptions: true,
  //     isOpenQualityOptions: false,
  //   });
  // }

  // openPlaybackSpeedOptions(e: Event, triggeredFromKeyboard: boolean = false){

  //   if( this.timeoutPlaybackSpeedsPanelFocusout ){
  //     clearTimeout(this.timeoutPlaybackSpeedsPanelFocusout);
  //   }
    
  //   // this.setState({
  //   //   openPlaybackSpeeds: new Date(),
  //   //   openPlaybackSpeedsFromKeyboard: triggeredFromKeyboard ? new Date() : false,
  //   //   isOpenSettingsOptions: false,
  //   //   isOpenPlaybackSpeedOptions: true,
  //   // });
  // }
  
  // closePlaybackSpeedOptions(e: Event, triggeredFromKeyboard: boolean = false){

  //   if( this.timeoutPlaybackSpeedsPanelFocusout ){
  //     clearTimeout(this.timeoutPlaybackSpeedsPanelFocusout);
  //   }

  //   this.setState({
  //     closePlaybackSpeeds: new Date(),
  //     closePlaybackSpeedsFromKeyboard: triggeredFromKeyboard ? new Date() : false,
  //     openSettings: new Date(),
  //     openSettingsFromKeyboard: triggeredFromKeyboard ? new Date() : false,
  //     isOpenSettingsOptions: true,
  //     isOpenPlaybackSpeedOptions: false,
  //   });
  // }

  /**/
  
  // isTheaterMode() {
  //   return this.state.theaterMode;
  // }

  // isFullscreen() {
  //   return this.player.isFullscreen();
  // }

  // isEnded() {
  //   return this.player.ended();
  // }
}
