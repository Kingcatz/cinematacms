import videojs from 'video.js';

import { PlayTouchButton } from './PlayTouchButton';

const VideoJsComponent = videojs.getComponent('Component');

interface PlayTouchButtonContainer extends videojs.Component{
  constructor( player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback ): PlayTouchButtonContainer;
  buildCSSClass(): string;
}

class PlayTouchButtonContainer extends VideoJsComponent{
  
  constructor( player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback ) {
    super(player, options, ready);
    this.addChild( new PlayTouchButton(player) );
    this.setAttribute('class', this.buildCSSClass());
  }
  
  buildCSSClass() {
    return 'vjs-touch-play-button';
  }
}

export { 
    PlayTouchButtonContainer
}