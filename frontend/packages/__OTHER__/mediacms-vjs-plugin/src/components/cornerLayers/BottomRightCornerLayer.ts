import { CornerLayer } from './CornerLayer';

export class BottomRightCornerLayer extends CornerLayer {

    buildCSSClass() {
        return super.buildCSSClass() + ' vjs-corner-bottom-right';
    }
}
