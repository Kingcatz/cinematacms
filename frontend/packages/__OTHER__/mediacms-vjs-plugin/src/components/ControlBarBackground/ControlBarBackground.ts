import videojs from 'video.js';

import './ControlBarBackground.scss';

const VideoJsComponent = videojs.getComponent('Component');

export class ControlBarBackground extends VideoJsComponent {

  constructor( player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback ) {

    super(player, options, ready);
    
    this.setAttribute('class', this.buildCSSClass());
  }
  
  buildCSSClass() {
    return 'vjs-bottom-bg';
  }
}
