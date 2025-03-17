import videojs from 'video.js';

import './TouchControlsContainer.scss';

const VideoJsComponent = videojs.getComponent('Component');

class TouchControlsWrapperComponent extends VideoJsComponent {

  constructor( player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback ) {
    super(player, options, ready);
    this.setAttribute('class', this.buildCSSClass());
  }
  
  buildCSSClass() {
    return 'vjs-touch-controls';
  }
}

export interface TouchButtonContainerOptions extends videojs.ComponentOptions{
  isHidden: boolean;
  isDisabled: boolean;
}

interface TouchControlsContainer extends videojs.Component{
  options_:TouchButtonContainerOptions,
  constructor( player: videojs.Player, options?: TouchButtonContainerOptions, ready?: videojs.Component.ReadyCallback ): TouchControlsContainer;
}

class TouchControlsContainer extends VideoJsComponent implements TouchControlsContainer{

  constructor( player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback ) {

    super(player, options, ready);

    const wrapper = new TouchControlsWrapperComponent(player);
    wrapper.addChild(this);
    
    player.addChild(wrapper);
  }
}

export {
  TouchControlsContainer,
}