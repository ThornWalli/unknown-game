'use strict';

import {
    DIRECTIONS,
    CLASSES,
    TYPES
} from '../utils/unit';

import uuid from 'uuid';
import Events from './Events';
import Position from './Position';

class Unit extends Events {
    constructor() {
        super();

        this._direction = DIRECTIONS.TOP;
        this._lastDirection = DIRECTIONS.DEFAULT;
        this._nextDirection = DIRECTIONS.DEFAULT;

        this._id = uuid();

        /**
         * Aktuelle Position.
         * @type {Position}
         */
        this.position = new Position();
        /**
         * Letzt Position
         * @type {Position}
         */
        this._lastPosition = new Position();
        /**
         * Temporäre Position nur bei bewegung vorhanden.
         * @type {Position}
         */
        this._nextPosition = new Position();

        /**
         * Offset zwischen zwei Positionen
         * @type {Position}
         */
        this._offsetPosition = new Position();

        /**
         * Wenn gesetzt ist Unit ausgewählt.
         * @type {Boolean}
         */
        this.selected = false;
        /**
         * Wenn gesetzt, kann Unit ausgewählt werden.
         * @type {Boolean}
         */
        this.selectable = false;
        /**
         * Wenn gesetzt, steht Unit nicht im Weg.
         * @type {Boolean}
         */
        this.walkable = true;


        this._types = [];

        this.setType(TYPES.UNIT);

    }

    // Functions

    setPosition(position) {
        this.setPositionValues(position.x, position.y);
    }
    setPositionValues(x, y) {
        this._lastPosition.setLocal(this.position);
        this.position.setValuesLocal(x, y);
        this.trigger('change.position', this, this.position, this._lastPosition);
        this.direction = setDirection(this.position, this.lastPosition);
    }

    remove() {
        this.trigger('remove', this);
    }

    destroy() {
        this.detacheEvents();
        // unit.off(null, null, this);
    }

    isType(type) {
        if (typeof type !== 'string') {
            type = type.type;
        }
        return this._types.indexOf(type) > -1;
    }

    setType(type) {
        this._types.push(type);
    }

    // Properties
    //
    /**
     * Relativer abstand von vorheriger, zu aktueller Position.
     * @return {Position}
     */
    get floatingPosition() {
        return this.lastPosition.add(this._offsetPosition);
    }
    // get extendedFloatingPosition() {
    //     return this.lastPosition.add(this._offsetPosition);
    // }

    get id() {
        return this._id;
    }

    get type() {
        return this._types[this._types.length - 1];
    }

    get direction() {
        return this._direction;
    }
    set direction(direction) {
        this._nextDirection = setDirection(this.nextPosition, this.position);
        this._lastDirection = this._direction;
        this._direction = direction;
        this.trigger('change.direction', this, direction);
    }

    get lastDirection() {
        return this._lastDirection;
    }
    get lastPosition() {
        return this._lastPosition;
    }

    get nextDirection() {
        return this._nextDirection;
    }
    get nextPosition() {
        return this._nextPosition;
    }
    set nextPosition(nextPosition) {
        this._nextPosition = nextPosition;
    }


    get offsetPosition() {
        return this._offsetPosition;
    }

    /**
     * @deprecated
     * Wurde ersetzt mit offsetPosition.
     * @return {Position}
     */
    get positionOffset() {
        return this._offsetPosition;
    }

}

TYPES.UNIT = 'unit';
CLASSES[TYPES.UNIT] = Unit;

function setDirection(position, lastPosition) {
    if (position.y === lastPosition.y) {
        if (position.x >= lastPosition.x) {
            return DIRECTIONS.RIGHT;
        } else {
            return DIRECTIONS.LEFT;
        }
    }
    if (position.x === lastPosition.x) {
        if (position.y >= lastPosition.y) {
            return DIRECTIONS.BOTTOM;
        } else {
            return DIRECTIONS.TOP;
        }
    }
}

export default Unit;
