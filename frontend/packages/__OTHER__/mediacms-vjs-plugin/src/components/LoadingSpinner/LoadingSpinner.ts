import videojs from 'video.js';

import './LoadingSpinner.scss';

const VideoJsComponent = videojs.getComponent('Component');

class LoadingSpinner extends VideoJsComponent {
  
    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback) {
        
        super(player, options, ready);
      
        this.el().innerHTML = '<div class="spinner">\
                                    <div class="spinner-container">\
                                        <div class="spinner-rotator">\
                                            <div class="spinner-left"><div class="spinner-circle"></div></div>\
                                            <div class="spinner-right"><div class="spinner-circle"></div></div>\
                                        </div>\
                                    </div>\
                                </div>';

        this.setAttribute('class', this.buildCSSClass());
    }
  
    buildCSSClass() {
        return 'vjs-loading-spinner';
    }
}

export{
    LoadingSpinner
}