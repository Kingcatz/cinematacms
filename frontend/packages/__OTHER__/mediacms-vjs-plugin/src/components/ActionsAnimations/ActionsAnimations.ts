import videojs from 'video.js';

import './ActionsAnimations.scss';

const VideoJsComponent = videojs.getComponent('Component');

class ActionsAnimations extends VideoJsComponent {

    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback) {
      super(player, options, ready);
      this.el().innerHTML = '<span></span>';      
      this.setAttribute('class', this.buildCSSClass());
    }
  
    buildCSSClass() {
      return 'vjs-actions-anim';
    }
}

export{
    ActionsAnimations
}