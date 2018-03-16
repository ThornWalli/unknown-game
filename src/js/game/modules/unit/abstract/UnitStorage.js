'use strict';

import Collection from '../../../base/Collection';
import Position from '../../../base/Position';

/**
 * Abstract Class Module
 * @class Storage
 */
export default Abstract => class extends Abstract {

    /**
     * @param {game.App} app
     * @param {game.base.Unit} unit
     */
    constructor(app, unit) {
        super(app, unit);
        /**
         * @type {Object}
         */
        this._storageUnits = new Collection();
        /**
         * Maximal Anzahl der Units.
         * @type {Number}
         */
        this._maxStorageUnits = 0;

        this._storagePortPosition = new Position();
    }

    // Functions

    /**
     * Fügt eine Unit hinzu.
     * @param {game.base.Unit} unit
     */
    add(unit) {
        this._storageUnits.add(unit);
        unit.spriteVisible = false;
        this.trigger('storage.units.add', this, unit);
    }

    /**
     * Entfernt eine Unit.
     * @param {game.base.Unit} unit
     */
    remove(unit) {
        this._storageUnits.remove(unit);
        unit.spriteVisible = true;
        this.trigger('storage.units.remove', this, unit);
    }

    /**
     * Trifft zu wenn keine Unit enthalten ist.
     * @return {Boolean}
     */
    isStorageEmpty() {
        return this._storageUnits.length === 0;
    }

    /**
     * Trifft zu wenn die maximale Anzahl an Units vorhanden ist.
     * @return {Boolean}
     */
    isStorageFull() {
        return this._maxStorageUnits === this._storageUnits.length;
    }

    /**
     * Ruft das freie Volumen ab.
     * @return {Number}
     */
    getFreeStorageValue() {
        return this._maxStorageUnits - this._storageUnits.length;
    }



    // Properties

    /**
     * @return {Array<game.base.Unit>}
     */
    get storageUnits() {
        return this._storageUnits;
    }

    /**
     * Ruft das maximale anzahl an Units ab.
     * @return {Number}
     */
    get maxStorageUnits() {
        return this._maxStorageUnits;
    }

    /**
     * Ruft die Position ab, in der eine Unit verladen werden kann.
     * @return {game.base.Position}
     */
    get storagePortPosition() {
        return this._storagePortPosition;
    }

};
