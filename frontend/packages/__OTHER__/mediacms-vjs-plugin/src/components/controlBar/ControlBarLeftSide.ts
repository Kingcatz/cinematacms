import videojs from 'video.js';

import { NextButton, PreviousButton } from './Buttons';

import { handleControlElemFocus } from '../../utils/functions';

const VideoJsComponent = videojs.getComponent('Component');

interface ControlBarLeftSideOptions extends videojs.ComponentOptions{
    hidePlay?: boolean,
    hidePrevious?: boolean,
    hideNext?: boolean,
    hideVolume?: boolean,
    hideTime?: boolean,
}

const defaultOptions: ControlBarLeftSideOptions = {
    hidePlay: false,
    hidePrevious: true,
    hideNext: true,
    hideVolume: false,
    hideTime: false,
};

interface ControlBarLeftSide extends videojs.Component{
    options_: ControlBarLeftSideOptions;
    buildCSSClass(): string;
}

class ControlBarLeftSide extends VideoJsComponent implements ControlBarLeftSide{
    
    constructor( player: videojs.Player, options?: ControlBarLeftSideOptions, ready?: videojs.Component.ReadyCallback ) {
        
        super(player, options, ready);

        if( ! this.options_.hidePrevious ){
            this.addChild(new PreviousButton(player));
        }

        if( ! this.options_.hidePlay ){
            this.addChild('playToggle');
            handleControlElemFocus(this.getChild('playToggle')?.el());
        }

        if( ! this.options_.hideNext ){
            this.addChild(new NextButton(player));
        }

        if( ! this.options_.hideVolume ){

            this.addChild('volumePanel');

            const volumePanel = this.getChild('volumePanel');
            
            if( volumePanel ){
                
                handleControlElemFocus(volumePanel.getChild('muteToggle')?.el());

                const volumeControl = volumePanel.getChild('volumeControl');

                if( volumeControl ){
                    handleControlElemFocus(volumeControl.getChild('volumeBar')?.el());
                }
            }
        }

        if( ! this.options_.hideTime ){
            this.addChild('currentTimeDisplay');
            this.addChild('timeDivider');
            this.addChild('durationDisplay');
        }

        this.setAttribute('class', this.buildCSSClass());
    }

    buildCSSClass() {
        return 'vjs-left-controls';
    }
}

ControlBarLeftSide.prototype.options_ = defaultOptions;

export {
    ControlBarLeftSide
}
