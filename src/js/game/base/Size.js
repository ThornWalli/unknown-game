'use strict';

import Position from './Position';

export default class Size extends Position {
    is(x, y) {
        if (x instanceof this.class) {
            return this.x === x.x && this.y === x.y;
        } else {
            return this.x === x && this.y === y;
        }
    }
    clone() {
        return new Size(this.x, this.y);
    }
    /*
     * Properties
     */

    get width() {
        return this.x;
    }
    set width(width) {
        this.x = width;
    }
    get height() {
        return this.y;
    }
    set height(height) {
        this.y = height;
    }


    get class() {
        return Size;
    }


}
