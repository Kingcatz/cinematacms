import videojs from 'video.js';

import { SettingPanelTitle } from './Title';
import { PanelWrapper, Panel } from './Panel';
import { ListItemProps, List, ListItem } from './List';

interface RootListItemOptions extends videojs.ComponentOptions{
    settingIndex: number,
    label: string,
    content: string,
    classname: string,
    onClick: ( settingIndex: number, ev: videojs.EventTarget.Event, hash?: any ) => void,
}

interface RootListItem extends ListItem{
    options_: RootListItemOptions;
    constructor( player: videojs.Player, options?: RootListItemOptions ): RootListItem;
}

interface RootListOptions extends videojs.ComponentOptions{
    items: RootListItemOptions[],
}

interface RootList extends List{
    options_: RootListOptions;
    constructor( player: videojs.Player, options?: RootListOptions, ready?: videojs.Component.ReadyCallback ): RootList;
}

class RootListItem extends ListItem implements RootListItem{
    
    constructor( player: videojs.Player, options?: RootListItemOptions ){

        super( player, options );

        this.el().innerHTML = '<div class="vjs-setting-menu-item-label">' + this.options_.label + '</div>\
                               <div class="vjs-setting-menu-item-content">' + this.options_.content + '</div>';

        this.setAttribute('class', this.buildCSSClass());
    }

    handleClick(ev: videojs.EventTarget.Event){
        this.options_.onClick( this.options_.settingIndex, ev, { keyboardTrigger: ! ev.screenX && ! ev.screenY } );
    }

    buildCSSClass() {
        return this.options_.classname + ' ' + super.buildCSSClass();
    }
}

class RootList extends List implements RootList{
    
    constructor( player: videojs.Player, options?: RootListOptions, ready?: videojs.Component.ReadyCallback ){
        super( player, options, ready );
    }
}

interface SettingListItemOptions extends ListItemProps, videojs.ComponentOptions{
    index: number;
    isSelected: boolean;
    onClick: ( option: string ) => void;
}

interface SettingListItem extends ListItem{
    options_: SettingListItemOptions;
    constructor( player: videojs.Player, options?: SettingListItemOptions ): SettingListItem;
}

class SettingListItem extends ListItem implements SettingListItem{
    
    constructor( player: videojs.Player, options?: SettingListItemOptions ){
        super( player, options );
        this.el().innerHTML = '<div class="vjs-setting-menu-item-content">' + this.options_.title + '</div>';
        this.setAttribute('class', this.buildCSSClass() );
    }

    handleClick(){
        this.options_.onClick( this.options_.value );
    }

    buildCSSClass() {
        return ( this.options_.isSelected ? 'vjs-selected-menu-item ' : '' ) + super.buildCSSClass();
    }
}

type SettingProps = {
    id: string,
    title: string;
    values: ListItemProps[];
    selected: string;
    paneClassname: string;
    optionClassname: string;
    onSelectTriggerEvent: string,
};

interface SettingsPanelOptions extends videojs.ComponentOptions{
    settings: SettingProps[];
}

interface SettingsPanel extends Panel {
    options_: SettingsPanelOptions;
    wrapper: PanelWrapper;
    settingsSelected : string[];
    rootPaneItems: RootListItem[];
    openSettingsPaneIndex: number;
    constructor(player: videojs.Player, options?: SettingsPanelOptions, ready?: videojs.Component.ReadyCallback): SettingsPanel;
    openPanel(ev: videojs.EventTarget.Event, hash?: any): void;
    openSettingPanel( settingIndex: number, ev: videojs.EventTarget.Event, hash?: any ): void;
    closePanel(): void;
    composeRootPanel(): void;
    composeSettingPanel(): void;
    refreshOpenSettingPanel(): void;
    clearPanel(): void;
    selectOption( selected: string ): void;
}

class SettingsPanel extends Panel implements SettingsPanel{
    
    wrapper: PanelWrapper;
    settingsSelected : string[] = [];
    rootPaneItems: RootListItem[] = [];
    openSettingsPaneIndex = -1;

    constructor( player: videojs.Player, options?: SettingsPanelOptions, ready?: videojs.Component.ReadyCallback ){

        super(player, options, ready);

        this.options_.settings.forEach( setting => this.settingsSelected.push(setting.selected) );

        this.wrapper = new PanelWrapper(player, { classname: 'vjs-settings-root' });

        this.wrapper.addChild(this);
        
        this.player_.getChild('controlBar')?.addChild(this.wrapper);

        this.closePanel = this.closePanel.bind(this);
        this.openPanel = this.openPanel.bind(this);
        this.openSettingPanel = this.openSettingPanel.bind(this);
        this.selectOption = this.selectOption.bind(this);
        
        player.on('showMainSettingsPane', this.openPanel);
        player.on('hideMainSettingsPane', this.closePanel);

        this.onBandwidthUpdate = this.onBandwidthUpdate.bind(this);
        player.on('updatedBandwidth', this.onBandwidthUpdate);
    }

    onBandwidthUpdate(){
        // console.log("UPDATE BANDWIDTH [2]", this.player_.videoHeight());
        const autoQualityEl = this.el().querySelector( '.auto-resolution-title' );
        if( autoQualityEl ){
            autoQualityEl.innerHTML = this.player_.videoHeight().toString();
        }
    }

    openPanel(ev: videojs.EventTarget.Event, hash?: any){
        this.clearPanel();
        this.wrapper.setClassname( 'vjs-settings-root vjs-settings-panel vjs-visible-panel' );
        this.openSettingsPaneIndex = -1;
        this.composeRootPanel();
        if( hash && hash.keyboardTrigger ){
            (<HTMLElement>this.el().querySelector('.vjs-settings-menu-item'))?.focus();
        }
    }

    openSettingPanel(settingIndex: number, ev: videojs.EventTarget.Event, hash?: any ){
        this.clearPanel();
        this.wrapper.setClassname( this.options_.settings[ settingIndex ].paneClassname + ' vjs-settings-panel vjs-visible-panel' );
        this.openSettingsPaneIndex = settingIndex;
        this.composeSettingPanel();
        if( hash && hash.keyboardTrigger ){
            (<HTMLElement>this.el().querySelector('.vjs-setting-panel-title > *'))?.focus();
        }
    }

    closePanel(){
        this.clearPanel();
        this.openSettingsPaneIndex = -1;
        this.wrapper.setClassname( 'vjs-settings-root vjs-settings-panel' );
    }
    
    composeRootPanel(){

        const menu = new RootList(this.player_);
        
        this.options_.settings.forEach( (setting, index) => {

            let selectedValueTitle = this.settingsSelected[index];
            let selectedValueTitlePostfix = '';

            if( 'quality' === setting.id ){

                if( 'Auto' === this.settingsSelected[index] || 'auto' === this.settingsSelected[index] ){

                    const videoHeight = this.player_.videoHeight();

                    if( videoHeight ){
                        selectedValueTitlePostfix = "&nbsp;<span class='auto-resolution-title'>" + this.player_.videoHeight() + "</span>";
                    }
                    
                    // console.log(setting.id, this.settingsSelected[index]);
                }
            }

            for(let i = 0; i < this.options_.settings[index].values.length; i++){
                if( this.options_.settings[index].values[i].value === this.settingsSelected[index] ){
                    selectedValueTitle = this.options_.settings[index].values[i].title;
                    break;
                }
            }

            const item = new RootListItem(this.player_, {
                settingIndex: index,
                onClick: this.openSettingPanel,
                classname: setting.optionClassname,
                label: setting.title,
                content: selectedValueTitle + selectedValueTitlePostfix,
            });

            menu.addChild(item);
        });
        
        this.addChild(menu);
    }

    composeSettingPanel(){
        const menu = new List(this.player_);
        this.options_.settings[ this.openSettingsPaneIndex ].values.forEach( ( setting, index ) => {
            const isSelected = this.settingsSelected[ this.openSettingsPaneIndex ] === setting.value;
            menu.addChild( new SettingListItem(this.player_, { index, isSelected, value: setting.value, title: setting.title, onClick: this.selectOption }));
        });
        this.addChild( new SettingPanelTitle(this.player_, { label: this.options_.settings[ this.openSettingsPaneIndex ].title, onClick: this.openPanel } ) );
        this.addChild(menu);
    }
    
    refreshOpenSettingPanel(){
        this.clearPanel();
        this.composeSettingPanel();
    }

    selectOption( selected: string ){
        if( selected !== this.settingsSelected[ this.openSettingsPaneIndex ] ){
            this.settingsSelected[ this.openSettingsPaneIndex ] = selected;
            this.refreshOpenSettingPanel();
            this.player_.trigger( this.options_.settings[ this.openSettingsPaneIndex ].onSelectTriggerEvent, selected );
            // this.closePanel();
        }
    }
}

export default SettingsPanel;

export {
    SettingsPanel,
    SettingListItem,
}
