import videojs from 'video.js';

const VideoJsComponent = videojs.getComponent('Component');
const VideoJsClickableComponent = videojs.getComponent('ClickableComponent');

export type ListItemProps = {
    value: string;
    title: string;
}

interface List extends videojs.Component{
    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback): List;
    buildCSSClass(): string;
}

interface ListItem extends videojs.ClickableComponent{
    constructor(player: videojs.Player, options?: videojs.ComponentOptions): ListItem;
    buildCSSClass(): string;
}

class List extends VideoJsComponent implements List {

    constructor(player: videojs.Player, options?: videojs.ComponentOptions, ready?: videojs.Component.ReadyCallback){
        super(player, options, ready);
        this.setAttribute('class', this.buildCSSClass());
    }

    buildCSSClass() {
        return 'vjs-settings-menu';
    }
}

class ListItem extends VideoJsClickableComponent implements ListItem{

    constructor( player: videojs.Player, options?: videojs.ComponentOptions ){
        super(player, options);
        this.setAttribute('class', this.buildCSSClass());
    }

    buildCSSClass() {
        return 'vjs-settings-menu-item';
    }
}

export {
    List,
    ListItem,
}
