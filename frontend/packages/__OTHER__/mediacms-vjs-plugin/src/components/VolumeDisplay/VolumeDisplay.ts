import videojs from 'video.js';

import './VolumeDisplay.scss';

const VideoJsComponent = videojs.getComponent('Component');

interface VolumeDisplay extends videojs.Component {
    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback): VolumeDisplay;
    buildCSSClass(): string;
    onVolumeChange(): void;
}

class VolumeDisplay extends VideoJsComponent implements VolumeDisplay {

    isHidden: boolean;
    displayTimeout: NodeJS.Timeout | null;
  
    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback) {
        
        super(player, options, ready);

        this.isHidden = true;
        this.displayTimeout = null;

        this.el().innerHTML = (player.volume() * 100).toFixed(0) + '%';

        this.setAttribute('class', this.buildCSSClass());

        this.onVolumeChange = this.onVolumeChange.bind(this);

        player.on('volumechange', this.onVolumeChange);
    }
  
    buildCSSClass() {
        return 'vjs-volume-display' + ( this.isHidden ? '' : ' vjs-volume-display-visible' );
    }

    onVolumeChange(){

        this.isHidden = false;

        if( this.player_.muted() ){
            this.el().innerHTML = '0%';
        }
        else{
            this.el().innerHTML = ( 100 * this.player_.volume() ).toFixed(0) + '%';
        }
        
        this.setAttribute('class', this.buildCSSClass());

        if( this.displayTimeout ){
            clearTimeout(this.displayTimeout);
        }
        
        this.displayTimeout = setTimeout(()=>{
            this.displayTimeout = null;
            this.isHidden = true;
            this.setAttribute('class', this.buildCSSClass());
        },500);
    }
}

export{
    VolumeDisplay
}