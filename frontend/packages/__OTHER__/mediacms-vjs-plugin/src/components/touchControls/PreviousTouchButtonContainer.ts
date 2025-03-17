import videojs from 'video.js';

import { TouchButtonContainerOptions } from './TouchControlsContainer';

import { PreviousTouchButton } from './PreviousTouchButton';

const VideoJsComponent = videojs.getComponent('Component');

interface PreviousTouchButtonContainer extends videojs.Component{
  options_: TouchButtonContainerOptions;
  constructor( player: videojs.Player, options?: TouchButtonContainerOptions, ready?: videojs.Component.ReadyCallback ): PreviousTouchButtonContainer;
  buildCSSClass(): string;
}

class PreviousTouchButtonContainer extends VideoJsComponent implements PreviousTouchButtonContainer{

  constructor( player: videojs.Player, options?: TouchButtonContainerOptions, ready?: videojs.Component.ReadyCallback ) {
    super(player, options, ready);
    this.addChild( new PreviousTouchButton(player) );
    this.setAttribute('class', this.buildCSSClass());
  }
  
  buildCSSClass() {
    return 'vjs-touch-previous-button ' + 
          ( this.options_.isHidden ? 'vjs-touch-hidden-button ' : '' ) +
          ( this.options_.isDisabled ? 'vjs-touch-disabled-button ' : '' );
  }
}

const PreviousTouchButtonContainerOptionsDefault: TouchButtonContainerOptions = {
  isHidden: true,
  isDisabled: true,
};

PreviousTouchButtonContainer.prototype.options_ = PreviousTouchButtonContainerOptionsDefault;

export {
    PreviousTouchButtonContainer
}