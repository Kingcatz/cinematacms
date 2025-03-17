import videojs from 'video.js';

const VideoClickableComponent = videojs.getComponent('ClickableComponent');

export class PlayTouchButton extends VideoClickableComponent{
  
    constructor(player: videojs.Player, options?: videojs.ComponentOptions) {
        super(player, options);
        this.setAttribute('class', this.buildCSSClass());
    }

    handleClick(event: videojs.EventTarget.Event): void{
        if( this.player_.paused() ){
            this.player_.play();
            // TODO: Possible improvement...?
            setTimeout( () => this.player_.userActive(false), 250 );
        }
        else{
            this.player_.pause();
        }
    }

    buildCSSClass() {
        return super.buildCSSClass() + ' vjs-icon-play';
    }
}
