'use strict';
import Position from './Position';

export default class PositionBounds {
    constructor(min = new Position(), max = new Position()) {
        this.setLocal(min, max);
    }
    set(min, max) {
        return this.setLocal(min, max, new PositionBounds());
    }
    setLocal(min, max, scope = this) {
        scope.min = min;
        scope.max = max;
        return scope;
    }

    intersect(position, y) {
        if (typeof y === 'number') {
            position = new Position(position, y);
        }
        if (
            position.x <= this.max.x && position.x >= this.min.x && position.y <= this.max.y && position.y >= this.min.y
        ) {
            return true;
        } else {
            return false;
        }
    }


    /*
     * Properties
     */

    get width() {
        return this.max.x - this.min.x;
    }
    get height() {
        return this.max.y - this.min.y;
    }

}
