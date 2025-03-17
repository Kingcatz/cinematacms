import videojs from 'video.js';

import { TouchButtonContainerOptions } from './TouchControlsContainer';

import { NextTouchButton } from './NextTouchButton';

const VideoJsComponent = videojs.getComponent('Component');

interface NextTouchButtonContainer extends videojs.Component{
  options_: TouchButtonContainerOptions;
  constructor( player: videojs.Player, options?: TouchButtonContainerOptions, ready?: videojs.Component.ReadyCallback ): NextTouchButtonContainer;
  buildCSSClass(): string;
}

class NextTouchButtonContainer extends VideoJsComponent implements NextTouchButtonContainer{

  constructor( player: videojs.Player, options?: TouchButtonContainerOptions, ready?: videojs.Component.ReadyCallback ) {
    super(player, options, ready);
    this.addChild( new NextTouchButton(player) );
    this.setAttribute('class', this.buildCSSClass());
  }
  
  buildCSSClass() {
    return 'vjs-touch-next-button ' + 
          ( this.options_.isHidden ? 'vjs-touch-hidden-button ' : '' ) +
          ( this.options_.isDisabled ? 'vjs-touch-disabled-button ' : '' );
  }
}

const NextTouchButtonContainerOptionsDefault: TouchButtonContainerOptions = {
  isHidden: true,
  isDisabled: true,
};

NextTouchButtonContainer.prototype.options_ = NextTouchButtonContainerOptionsDefault;

export {
    NextTouchButtonContainer,
}