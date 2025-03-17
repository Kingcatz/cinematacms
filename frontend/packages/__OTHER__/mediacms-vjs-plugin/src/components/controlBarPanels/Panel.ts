import videojs from 'video.js';

const VideoJsComponent = videojs.getComponent('Component');

interface PanelWrapperElement extends Element {
    addEventListener(type: string, listener: { (ev: FocusEvent): void } | EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions ): void;
    contains(other: EventTarget | Node | null): boolean;
}

interface PanelWrapperOptions extends videojs.ComponentOptions {
    classname: string,
}

interface PanelWrapper extends videojs.Component {
    options_: PanelWrapperOptions,
    constructor( player: videojs.Player, options?: PanelWrapperOptions, ready?: videojs.Component.ReadyCallback ): PanelWrapper;
    onFocusout(ev: FocusEvent): void;
    setClassname( classname: string ): void;
    buildCSSClass(): string;
}

class PanelWrapper extends VideoJsComponent implements PanelWrapper{

    classname = '';

    constructor( player: videojs.Player, options?: PanelWrapperOptions, ready?: videojs.Component.ReadyCallback ){

        super(player, options, ready);
        
        this.classname = this.options_.classname;
        
        this.setAttribute('class', this.buildCSSClass());
        
        this.setAttribute('tabindex', '-1');

        this.onFocusout = this.onFocusout.bind(this);

        (<PanelWrapperElement>this.el()).addEventListener('focusout', this.onFocusout );
    }

    onFocusout(ev: FocusEvent){
        // If panel content change, then null === ev.relatedTarget.
        if (ev.relatedTarget && !(<PanelWrapperElement>this.el()).contains(ev.relatedTarget)) {
            this.player_.focus();
        }
    }

    setClassname( classname: string ){
        this.classname = classname;
        this.setAttribute('class', this.buildCSSClass());
    }

    buildCSSClass() {
        return 'vjs-settings-panel ' + this.classname;
    }
}

interface Panel extends videojs.Component {
    constructor( player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback ): Panel;
    clearPanel(): void;
    buildCSSClass(): string;
}

class Panel extends VideoJsComponent implements Panel{

    constructor( player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback ){
        super(player, options, ready);
        this.setAttribute('class', this.buildCSSClass());
    }
    
    clearPanel(){
        let children = this.children();
        while(children.length){
            this.removeChild( children[0] );
            children = this.children();
        }
    }

    buildCSSClass() {
        return 'vjs-settings-panel-inner';
    }
}

export {
    PanelWrapper,
    Panel,
}
