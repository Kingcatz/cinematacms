import { CornerLayer } from './CornerLayer';

export class TopRightCornerLayer extends CornerLayer {

    buildCSSClass() {
        return super.buildCSSClass() + ' vjs-corner-top-right';
    }
}
