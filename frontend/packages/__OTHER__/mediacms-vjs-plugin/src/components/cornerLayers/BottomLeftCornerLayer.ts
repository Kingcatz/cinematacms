import { CornerLayer } from './CornerLayer';

export class BottomLeftCornerLayer extends CornerLayer {

    buildCSSClass() {
        return super.buildCSSClass() + ' vjs-corner-bottom-left';
    }
}
