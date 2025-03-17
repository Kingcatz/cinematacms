import { CornerLayer } from './CornerLayer';

export class TopLeftCornerLayer extends CornerLayer {

    buildCSSClass() {
        return super.buildCSSClass() + ' vjs-corner-top-left';
    }
}
