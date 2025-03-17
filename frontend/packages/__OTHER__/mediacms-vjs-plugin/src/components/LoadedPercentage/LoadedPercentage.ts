import videojs from 'video.js';

import './LoadedPercentage.scss';

const VideoJsComponent = videojs.getComponent('Component');

class LoadingTimer {
    
    protected running = false;
    protected timerId: NodeJS.Timeout | null = null;
    protected percentage = 0;
    protected max = 100;
    protected frequency = 1000;
    protected step = 1;

    constructor( public updateCallback?: ( percentage: number ) => void ){}

    update( percentage = 0, max = 100, frequency = 1000, step = 1 ){
        if( this.running ){
            this.stop();
        }
        this.percentage = percentage;
        this.frequency = frequency;
        this.step = step;
        if( this.max >= this.percentage ){
            this.start();
        }
    }

    protected start(){

        if( this.running ){
            return;
        }
        
        this.running = true;

        if( this.updateCallback ){
            this.updateCallback( this.percentage );
        }
        
        this.timerId = setInterval(()=>{
            
            if( this.max === this.percentage ){
                this.stop();
                return;
            }
            
            this.percentage = Math.min( this.max, this.percentage + this.step );

            if( this.updateCallback ){
                this.updateCallback( this.percentage );
            }

        }, this.frequency);
    }

    protected stop(){

        if( ! this.running ){
            return;
        }

        this.running = false;
        
        if( this.timerId ){
            clearInterval(this.timerId);
        }
    }
}

interface PercentageValueComponentOptions extends videojs.ComponentOptions{
    onUpdate?: (percentage:number) => any,
}

interface PercentageValue extends videojs.Component {
    options_: PercentageValueComponentOptions;
    constructor(player: videojs.Player, options?: PercentageValueComponentOptions, ready?: videojs.Component.ReadyCallback): PercentageValue;
    onProgress(): void;
    onUpdate( loadingPercent: number ): void;
    onReadyStateChange(): void;
}

/*
 * @link: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
 * @link: https://docs.videojs.com/html5#readyState
 */
class PercentageValue extends VideoJsComponent implements PercentageValue {
    
    readyState: number;
    loadingPercent: number;
    loadingTimer: LoadingTimer;
    onUpdateCallback?: (percentage: number) => void;
    
    loadingInfo: { [videoHeight: number]: { [readyState: number]: { counter: number, value: number } } } = {};
    progressInfo: { [videoHeight: number]: { currentTime: number; totalDuration?: number; bufferedPercent: number; } } = {};

    constructor(player: videojs.Player, options?: PercentageValueComponentOptions, ready?: videojs.Component.ReadyCallback) {

        super(player, options, ready);
        
        this.readyState = 0;
        this.loadingPercent = 0;

        if( options && options.onUpdate ){
            this.onUpdateCallback = options.onUpdate;
        }
        
        this.onProgress = this.onProgress.bind(this);
        player.on( 'progress', this.onProgress );

        this.onUpdate = this.onUpdate.bind(this);
        this.loadingTimer = new LoadingTimer( this.onUpdate );
    }

    onProgress(){
        
        const readyState = this.player_.readyState();

        if( readyState !== this.readyState ){
            
            const currentTime = Date.now();
            const totalDuration = this.player_.duration();
            const videoHeight = this.player_.videoHeight();
            const bufferedPercent = this.player_.bufferedPercent();
            
            switch( readyState ){
                case 1:
                case 2:
                    this.progressInfo[videoHeight] = { currentTime, bufferedPercent };
                    break;
                case 3:
                case 4:

                    if( this.progressInfo[videoHeight] && ( 1 === this.readyState || 2 === this.readyState ) ){

                        if( 0.0001 < ( bufferedPercent - this.progressInfo[videoHeight].bufferedPercent ) ){

                            if( ! this.loadingInfo[videoHeight] ){
                                this.loadingInfo[videoHeight] = {
                                    [this.readyState] : {
                                        counter: 1,
                                        value: 1000 * totalDuration * bufferedPercent,
                                    },
                                };
                            }
                            else if( ! this.loadingInfo[videoHeight][this.readyState] ){
                                this.loadingInfo[videoHeight][this.readyState] = {
                                    counter: 1,
                                    value: 1000 * totalDuration * bufferedPercent,
                                };
                            }
                            else if( bufferedPercent > this.progressInfo[videoHeight].bufferedPercent ){

                                const counter = this.loadingInfo[videoHeight][this.readyState].counter;

                                // console.log(
                                //     '[' + this.readyState + ' ~ ' + readyState + ']',
                                //     this.loadingInfo[videoHeight][this.readyState].value, 
                                //     ( 1000 * totalDuration * ( bufferedPercent - this.progressInfo[videoHeight].bufferedPercent ) ),
                                //     bufferedPercent,
                                //     ( bufferedPercent - this.progressInfo[videoHeight].bufferedPercent )
                                // );

                                const factor = Math.max( 0.1, 1 / ( counter + 1 ) );

                                this.loadingInfo[videoHeight][this.readyState].value = 
                                ( ( 1 - factor ) * this.loadingInfo[videoHeight][this.readyState].value ) + 
                                ( factor * ( 1000 * totalDuration * ( bufferedPercent - this.progressInfo[videoHeight].bufferedPercent ) ) );

                                this.loadingInfo[videoHeight][this.readyState].counter = counter + 1;
                                
                            }
                        }
                    }
                    break;
                default:
            }

            this.readyState = readyState;
            this.onReadyStateChange();
        }
        else{
            this.readyState = readyState;
        }
    }

    onUpdate( loadingPercent: number ){
        this.loadingPercent = loadingPercent;
        if( this.onUpdateCallback ){
            this.onUpdateCallback( this.loadingPercent );
        }
    }
    
    onReadyStateChange(){

        switch( this.readyState ){
            case 1:
            case 2:
                const min = 0;
                const max = 100;
                const videoHeight = this.player_.videoHeight();
                if( this.loadingInfo[videoHeight] && this.loadingInfo[videoHeight][this.readyState] ){
                    // console.log( this.readyState, '=>', this.loadingInfo[videoHeight][this.readyState] );
                    const stepFreq = this.loadingInfo[videoHeight][this.readyState].value / max;
                    this.loadingTimer.update( min, max, 500, Math.floor(500/stepFreq) );
                }
                break;
            default:
                this.loadingTimer.update( -1, -1, 1, 0 );
        }
    }
}

interface LoadedPercentage extends videojs.Component {
    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback): LoadedPercentage;
    buildCSSClass(): string;
    update(): void;
}

class LoadedPercentage extends VideoJsComponent implements LoadedPercentage {
    
    percentage = -1;
    cell_1: PercentageValue;
    cell_2: videojs.Component;
    isVisible = false;
    waiting = false;
    seeking = false;
    timeWhenWaiting = 0;
  
    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback) {
        
        super(player, options, ready);

        const inner = new VideoJsComponent(player);
        
        this.cell_1 = new PercentageValue(player, { onUpdate: (percentage:number) =>{
            this.percentage = percentage;
            this.update();
        } } );

        this.cell_2 = new VideoJsComponent(player);

        inner.addChild(this.cell_1);
        inner.addChild(this.cell_2);
        
        this.addChild( inner );

        this.update();
    }

    buildCSSClass() {
        return 'vjs-loaded-percent' + ( this.isVisible ? ' vjs-loaded-percent-visible' : '' );
    }
    
    update(){

        this.isVisible = 0 <= this.percentage && 100 >= this.percentage;

        if( this.isVisible ){
            this.cell_1.el().innerHTML = this.percentage.toString();
            this.cell_2.el().innerHTML = '%';
        }
        else{
            this.cell_1.el().innerHTML = '';
            this.cell_2.el().innerHTML = '';
        }

        this.setAttribute('class', this.buildCSSClass());
    }
}

export{
    LoadedPercentage
}
