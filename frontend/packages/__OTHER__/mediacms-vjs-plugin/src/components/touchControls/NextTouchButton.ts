import videojs from 'video.js';

const VideoClickableComponent = videojs.getComponent('ClickableComponent');

export class NextTouchButton extends VideoClickableComponent{
  
    constructor(player: videojs.Player, options?: videojs.ComponentOptions) {
        super(player, options);
        this.setAttribute('class', this.buildCSSClass());
    }

    handleClick(event: videojs.EventTarget.Event): void{
        this.player_.trigger('clicknext');
    }
  
    buildCSSClass() {
        return super.buildCSSClass() + ' vjs-icon-next-item';
    }
}
