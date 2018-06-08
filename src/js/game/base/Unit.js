'use strict';

import {
    DIRECTIONS,
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../types';

import uuid from 'uuid';
import Events from './Events';
import Position from './Position';

import SyncPromise from 'sync-p';

class Unit extends Events {
    constructor() {
        super();

        this._direction = DIRECTIONS.TOP;
        this._lastDirection = DIRECTIONS.DEFAULT;
        this._nextDirection = DIRECTIONS.DEFAULT;

        this._id = uuid();

        /**
         * Gibt an ob Unit aktiv ist
         * @type {Boolean}
         */
        this._active = true;

        /**
         * Gibt an ob Unit gelöscht werden soll.
         * Wird verwendet bei einem Abriss von einem Lager, dieses muss erst leer sein zum löschen.
         * @type {Boolean}
         */
        this._removed = true;

        /**
         * Gibt an ob Unit sichtbar ist.
         * @type {Boolean}
         */
        this._visible = true;

        /**
         * Gibt die UnitStorage, in dem sich die Unit befindet.
         * @type {Unit}
         */
        this._storage = null;

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
        this._selected = false;
        /**
         * Wenn gesetzt, steht Unit nicht im Weg.
         * @type {Boolean}
         */
        this._walkable = true;
        /**
         * @type {game.base.Position}
         */
        this._portOffset = new Position();

        /**
         * Beinhaltet alle Typen die von der Unit verwendet werden.
         * @type {Array}
         */
        this._types = [];

        // Set Default Type
        this.setType(UNIT_TYPES.DEFAULT);

    }

    /*
     * Functions
     */

    setPosition(position) {
        this.setPositionValues(position.x, position.y);
    }
    setPositionValues(x, y) {
        this._lastPosition.setLocal(this.position);
        this.position.setValuesLocal(x, y);
        this.trigger('change.position', this, this.position, this._lastPosition);
        this.direction = setDirection(this.position, this.lastPosition);
    }

    /**
     * Setzt fest das die Unit gelöscht werden soll.
     */
    setToRemove(toggle) {
        if (toggle) {
            this._setToRemove = !this._setToRemove;
            this.active = !this.active;
        } else {
            this._setToRemove = true;
            this.active = false;
        }

        let result = [];
        if (this.isType(UNIT_TYPES.ACTION)) {
            if (this._activeAction) {
                result.push(this._activeAction.stop());
            }
        }

        if (!this.active) {
            if (this.isType(UNIT_TYPES.MODULE)) {
                result.push(this.module.destroy());
            }
            console.log('this.module.destroy()', result);
            this.trigger('change.setToRemove', this, this._setToRemove);
            return SyncPromise.all(result).then(() => {
                console.log('JOOOOOOO2000 3');
                this.remove();
            });
        } else {
            return SyncPromise.all(result);
        }
    }

    /**
     * Fragt ab ob Unit gelöscht werden soll.
     * @return {Boolean}
     */
    isSetToRemove() {
        return this._setToRemove;
    }

    /**
     * Löscht die angegebene Unit.
     */
    remove() {
        this.trigger('remove', this);
    }

    destroy() {
        this.detacheEvents();
        // unit.off(null, null, this);
    }

    /**
     * Überprüft ob angegebene Unit übereinstimmt.
     * @param  {game.base.Unit}  unit
     * @return {Boolean}
     */
    is(unit) {
        return this.id === unit.id;
    }
    /**
     * Überprüft ob angegebene(r) Type(n) mit der Unit übereinstimmen.
     * @param  {game.types.Units}  type
     * @return {Boolean}
     */
    isType(type) {
        if (typeof type !== 'string') {
            type = type.type;
        }
        return this._types.indexOf(type) > -1;
    }

    /**
     * Vergibt der Unit einen Typ.
     * @param  {game.types.Units}  type
     */
    setType(type) {
        this._types.push(type);
    }

    import (data) {
        Object.keys(data).forEach(property => {
            if (property === 'module') {
                Object.keys(data.module).forEach(property => {
                    this.importSetProperty(property, data[property], true);
                    this.module[property] = data.module[property];
                });
            } else {
                this.importSetProperty(property, data[property]);
            }
        });
    }

    importSetProperty(name, value, isModule) {
        let scope = this;
        if (isModule) {
            scope = this.module;
        }
        if (scope[name] instanceof Position) {
            scope.position.setLocal(value);
        } else {
            scope[name] = value;
        }
    }

    export () {
        const data = {
            active: this.active,
            type: this.type,
            position: this.position.toJSON()
        };

        if (this.user) {
            data.user = this.user.id;
        }
        if (this.module) {
            data.module = Array.from(this.module.exportableProperties).reduce((result, property) => {
                if (this.module[property]) {
                    result[property] = this.module[property];
                }
                return result;
            }, {});
        }
        return data;

    }

    /*
     * Properties
     */

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
    get types() {
        return this._types;
    }

    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
        this.trigger('change.active', this, value);
    }

    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        this.trigger('change.visible', this, value);
    }


    get storage() {
        return this._storage;
    }
    set storage(value) {
        this._storage = value;
        this.trigger('change.storage', this, value);
    }

    /**
     * Wenn gesetzt, kann Unit ausgewählt werden.
     * @type {Boolean}
     */
    get selectable() {
        return this._selectable;
    }
    set selectable(selectable) {
        this._selectable = selectable;
    }

    get walkable() {
        if (!this._active) {
            return true;
        } else {
            return this._walkable;
        }
    }
    set walkable(walkable) {
        this._walkable = walkable;
    }

    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this.trigger('change.selected', this, value);
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

UNIT_TYPES.DEFAULT = 'default';
UNIT_CLASSES[UNIT_TYPES.DEFAULT] = Unit;

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
