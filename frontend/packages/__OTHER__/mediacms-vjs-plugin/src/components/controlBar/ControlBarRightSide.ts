import videojs from 'video.js';

import { SettingsToggleButton, SubtitlesToggleButton, TheaterModeToggleButton } from './Buttons';

import { handleControlElemFocus } from '../../utils/functions';

const VideoJsComponent = videojs.getComponent('Component');

interface ControlBarRightSideOptions extends videojs.ComponentOptions{
  hideSubtitles?: boolean,
  hideFullscreen?: boolean,
  hideTheaterMode?: boolean,
  theaterModeState?: boolean,
  hidePictureInPicture?: boolean,
  hideSettings?: boolean,
}

const defaultOptions: ControlBarRightSideOptions = {
  hideSubtitles: true,
  hideFullscreen: false,
  hideTheaterMode: true,
  theaterModeState: false,
  hidePictureInPicture: true,
  hideSettings: true,
};

interface ControlBarRightSide extends videojs.Component{
  options_: ControlBarRightSideOptions;
  constructor( player: videojs.Player, options?: ControlBarRightSideOptions, ready?: videojs.Component.ReadyCallback ): ControlBarRightSide;
  buildCSSClass(): string;
}

class ControlBarRightSide extends VideoJsComponent implements ControlBarRightSide{

  constructor( player: videojs.Player, options?: ControlBarRightSideOptions, ready?: videojs.Component.ReadyCallback ) {
    
    super(player, options, ready);

    if( ! this.options_.hideSubtitles ){
      this.addChild( new SubtitlesToggleButton(player) );
    }

    if( ! this.options_.hideSettings ){
      this.addChild( new SettingsToggleButton(player) );
    }

    if( ! this.options_.hideTheaterMode ){
      this.addChild( new TheaterModeToggleButton(player, { isChecked: options? options.theaterModeState : false }) );
    }

    if( ! this.options_.hidePictureInPicture ){
      this.addChild( 'pictureInPictureToggle' );
      handleControlElemFocus(this.getChild('pictureInPictureToggle')?.el());
    }

    if( ! this.options_.hideFullscreen ){
      this.addChild( 'fullscreenToggle' );
      handleControlElemFocus(this.getChild('fullscreenToggle')?.el());
    }

    this.setAttribute('class', this.buildCSSClass());
  }

  buildCSSClass() {
    return 'vjs-right-controls';
  }
}

ControlBarRightSide.prototype.options_ = defaultOptions;

export {
  ControlBarRightSide
}