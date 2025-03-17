import videojs from 'video.js';

import { SubtitlesPanelTitle } from './Title';
import { PanelWrapper, Panel } from './Panel';
import { ListItemProps, List } from './List';
import { SettingListItem } from './SettingsPanel';

type SubtitlesSettingProps = {
    title: string;
    values: ListItemProps[];
    selected: string;
};

interface SubtitlesPaneOptions extends videojs.ComponentOptions{
    settings: SubtitlesSettingProps[];
}

interface SubtitlesPanel extends Panel {
    options_: SubtitlesPaneOptions;
    wrapper: PanelWrapper;
    settingsSelected : string[];
    openSettingsPaneIndex: number;
    constructor(player: videojs.Player, options?: SubtitlesPaneOptions, ready?: videojs.Component.ReadyCallback ): SubtitlesPanel;
    openPanel(ev: videojs.EventTarget.Event, hash?: any): void;
    closePanel(): void;
    composePanel(): void;
    refreshOpenSettingPanel(): void;
    selectOption(selected: string): void;
    playerSubtitleClassname(selected: string): void;
}

class SubtitlesPanel extends Panel implements SubtitlesPanel{

    wrapper: PanelWrapper;
    settingsSelected : string[] = [];
    openSettingsPaneIndex = -1;

    constructor(player: videojs.Player, options?: SubtitlesPaneOptions, ready?: videojs.Component.ReadyCallback ){
        
        super( player, options, ready );

        this.options_.settings.forEach( setting => this.settingsSelected.push(setting.selected) );

        this.wrapper = new PanelWrapper(player, {
            classname: 'vjs-subtitles-panel'
        });

        this.wrapper.addChild(this);

        this.player_.getChild('controlBar')?.addChild(this.wrapper);

        this.openPanel = this.openPanel.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.selectOption = this.selectOption.bind(this);

        player.on('showSubtitlesPane', this.openPanel);
        player.on('hideSubtitlesPane', this.closePanel);
        
        this.playerSubtitleClassname(this.options_.settings[0].selected);
    }

    openPanel(ev: videojs.EventTarget.Event, hash?: any){
        this.clearPanel();
        this.wrapper.setClassname( 'vjs-subtitles-panel vjs-settings-panel vjs-visible-panel' );
        this.openSettingsPaneIndex = 0;
        this.composePanel();
        if( hash && hash.keyboardTrigger ){
            (<HTMLElement>this.el().querySelector('.vjs-settings-menu-item'))?.focus();
        }
    }

    closePanel(){
        this.clearPanel();
        this.openSettingsPaneIndex = -1;
        this.wrapper.setClassname( 'vjs-subtitles-panel vjs-settings-panel' );
    }

    composePanel(){
        const menu = new List(this.player_);
        this.options_.settings[ this.openSettingsPaneIndex ].values.forEach( ( setting, index ) => {
            const isSelected = this.settingsSelected[ this.openSettingsPaneIndex ] === setting.value;
            menu.addChild( new SettingListItem(this.player_, { index, isSelected, value: setting.value, title: setting.title, onClick: this.selectOption }));
        });
        this.addChild( new SubtitlesPanelTitle(this.player_, { label: this.options_.settings[ this.openSettingsPaneIndex ].title } ) );
        this.addChild(menu);
    }
    
    refreshOpenSettingPanel(){
        this.clearPanel();
        this.composePanel();
    }

    selectOption(selected: string){
        if( selected !== this.settingsSelected[ this.openSettingsPaneIndex ] ){
            this.settingsSelected[ this.openSettingsPaneIndex ] = selected;
            this.refreshOpenSettingPanel();
            this.player_.trigger('subtitleChange', selected);
            this.playerSubtitleClassname(selected);
        }
    }

    playerSubtitleClassname(selected: string){
        if( 'off' === selected ){
            this.player_.removeClass('vjs-subtitles-on');
            this.player_.addClass('vjs-subtitles-off');
        }
        else {
            this.player_.removeClass('vjs-subtitles-off');
            this.player_.addClass('vjs-subtitles-on');
        }
    }
}

export default SubtitlesPanel;

export {
    SubtitlesPanel,
}
