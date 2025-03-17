import videojs from 'video.js';

import { handleControlElemFocus } from '../../utils/functions';

const VideoClickableComponent = videojs.getComponent('ClickableComponent');

interface Button extends videojs.ClickableComponent {
  constructor(player: videojs.Player, options?: videojs.ComponentOptions): Button;
}

interface NextButton extends Button{
  constructor(player: videojs.Player, options?: videojs.ComponentOptions): NextButton;
  handleClick(ev: videojs.EventTarget.Event): void;
  buildCSSClass(): void;
}

interface PreviousButton extends Button{
  constructor(player: videojs.Player, options?: videojs.ComponentOptions): PreviousButton;
  handleClick(ev: videojs.EventTarget.Event): void;
  buildCSSClass(): void;  
}

interface TheaterModeToggleButtonOptions extends videojs.ComponentOptions{
  isChecked?: boolean;
}

interface TheaterModeToggleButton extends Button{
  options_: TheaterModeToggleButtonOptions,
  constructor(player: videojs.Player, options?: videojs.ComponentOptions): TheaterModeToggleButton;
  handleClick(ev: videojs.EventTarget.Event): void;
  buildCSSClass(): void;
  setControlText(): void;
}

interface SettingsToggleButton extends Button{
  constructor(player: videojs.Player, options?: videojs.ComponentOptions): SettingsToggleButton;
  handleClick(ev: videojs.EventTarget.Event): void;
  buildCSSClass(): void;
}

interface SubtitlesToggleButton extends Button{
  constructor(player: videojs.Player, options?: videojs.ComponentOptions): SubtitlesToggleButton;
  handleClick(ev: videojs.EventTarget.Event): void;
  buildCSSClass(): void;  
}

class Button extends VideoClickableComponent implements Button{
  
  constructor(player: videojs.Player, options?: videojs.ComponentOptions) {
    super(player, options);
    handleControlElemFocus(this.el());
    this.setAttribute('class', this.buildCSSClass());
  }
}

class NextButton extends Button implements NextButton {

  handleClick(ev: videojs.EventTarget.Event){
    this.player_.trigger('clicknext');
  }
    
  buildCSSClass() {
    return 'vjs-next-button ' + super.buildCSSClass();
  }
}

class PreviousButton extends Button implements PreviousButton {

  handleClick(ev: videojs.EventTarget.Event){
      this.player_.trigger('clickprevious');
  }
    
  buildCSSClass() {
      return 'vjs-previous-button ' + super.buildCSSClass();
  }
}

class TheaterModeToggleButton extends Button implements TheaterModeToggleButton {
  
  isChecked: boolean;
  
  constructor(player: videojs.Player, options?: TheaterModeToggleButtonOptions) {
    super(player, options);
    this.isChecked = undefined !== this.options_.isChecked ? this.options_.isChecked : false;
    this.setControlText();
  }

  handleClick(ev: videojs.EventTarget.Event){
    this.isChecked = ! this.isChecked;
    this.setControlText();
    this.player_.trigger('theatermodechange');
  }
  
  buildCSSClass() {
    return 'vjs-theater-mode-control ' + super.buildCSSClass();
  }

  setControlText(){
    this.controlText(this.player_.localize(this.isChecked ? 'Default view' : 'Theater mode'));
  }
}

class SettingsToggleButton extends Button implements SettingsToggleButton {

  handleClick(ev: videojs.EventTarget.Event){
    this.player_.trigger( 'settingsMainPaneChange', ! ev.screenX && ! ev.screenY );
  }

  buildCSSClass() {
    return 'vjs-settings-control vjs-icon-cog ' + super.buildCSSClass();
  }
}

class SubtitlesToggleButton extends Button implements SubtitlesToggleButton {

  handleClick(ev: videojs.EventTarget.Event){
    this.player_.trigger( 'subtitlesPaneChange', ! ev.screenX && ! ev.screenY );
  }
  
  buildCSSClass() {
    return 'vjs-subtitles-control ' + super.buildCSSClass();
  }
}

export{
  NextButton,
  PreviousButton,
  TheaterModeToggleButton,
  SettingsToggleButton,
  SubtitlesToggleButton
}
