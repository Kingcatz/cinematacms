import videojs from 'video.js';

const VideoJsComponent = videojs.getComponent('Component');
const VideoJsClickableComponent = videojs.getComponent('ClickableComponent');

interface SettingPanelTitleOptions extends videojs.ComponentOptions{
    label: string;
    onClick: (event: any, hash?: any) => void;
}

interface SettingPanelTitle extends videojs.Component{
    options_: SettingPanelTitleOptions;
    constructor( player: videojs.Player, options?: SettingPanelTitleOptions, ready?: videojs.Component.ReadyCallback ): SettingPanelTitle;
    buildCSSClass(): string;
}

interface SettingPanelTitleInner extends videojs.ClickableComponent{
    options_: SettingPanelTitleOptions;
    constructor( player: videojs.Player, options?: SettingPanelTitleOptions ): SettingPanelTitleInner;
}

interface SubtitlesPanelTitleOptions extends videojs.ComponentOptions{
    label: string;
}

interface SubtitlesPanelTitle extends videojs.Component{
    options_: SubtitlesPanelTitleOptions;
    constructor( player: videojs.Player, options?: SubtitlesPanelTitleOptions, ready?: videojs.Component.ReadyCallback ): SubtitlesPanelTitle;
    buildCSSClass(): string;
}

class SettingPanelTitle extends VideoJsComponent implements SettingPanelTitle{
    
    constructor( player: videojs.Player, options?: SettingPanelTitleOptions, ready?: videojs.Component.ReadyCallback ){
        super( player, options, ready );
        this.addChild( new SettingPanelTitleInner( player, this.options_ ) );
        this.setAttribute('class', this.buildCSSClass());
    }

    buildCSSClass() {
        return 'vjs-setting-panel-title vjs-settings-back';
    }
}

class SettingPanelTitleInner extends VideoJsClickableComponent implements SettingPanelTitleInner{
    
    constructor( player: videojs.Player, options?: SettingPanelTitleOptions ){
        super( player, options );
        this.el().innerHTML = this.options_.label;
        this.removeAttribute('class');
    }

    handleClick(ev: videojs.EventTarget.Event){
        this.options_.onClick(ev, { keyboardTrigger: ! ev.screenX && ! ev.screenY });
    }
}

class SubtitlesPanelTitle extends VideoJsComponent implements SubtitlesPanelTitle{
    
    constructor( player: videojs.Player, options?: SubtitlesPanelTitleOptions, ready?: videojs.Component.ReadyCallback ){
        super( player, options, ready );
        this.el().innerHTML = this.options_.label;
        this.setAttribute('class', this.buildCSSClass());
    }

    buildCSSClass() {
        return 'vjs-setting-panel-title';
    }
}

export {
    SettingPanelTitle,
    SettingPanelTitleInner,
    SubtitlesPanelTitle,
}
