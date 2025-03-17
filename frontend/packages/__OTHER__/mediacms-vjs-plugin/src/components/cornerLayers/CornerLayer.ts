import videojs from 'video.js';

import './CornerLayer.scss';

const VideoJsComponent = videojs.getComponent('Component');

interface CornerLayerOptions extends videojs.ComponentOptions{
    content: HTMLElement | string;
}

interface CornerLayer extends videojs.Component{
    options_: CornerLayerOptions;
    constructor( player: videojs.Player, options?: CornerLayerOptions, ready?: videojs.Component.ReadyCallback ): CornerLayer;
    buildCSSClass(): string;
}

class CornerLayer extends VideoJsComponent implements CornerLayer {

    constructor( player: videojs.Player, options?: CornerLayerOptions, ready?: videojs.Component.ReadyCallback ) {

        super(player, options, ready);

        if( 'string' === typeof this.options_.content ){
            this.el().innerHTML = this.options_.content;
        }
        else{
            this.addChild( this.options_.content );
        }
        
        this.setAttribute('class', this.buildCSSClass());
    }
    
    buildCSSClass() {
        return 'vjs-corner-layer';
    }
}

export {
    CornerLayer
}