'use strict';

import Collection from '../../../base/Collection';

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
         * @type {game.base.Collection}
         */
        this._unitStorageUnits = new Collection();
        /**
         * @type {Number}
         */
        this._maxUnitStorageUnits = 0;
        /**
         * @type {Array<game.types.units>}
         */
        this._allowedUnitStorageUnits = [];
        /**
         * @type {game.base.unit.Storage}
         */
        this._unitStoragePreferredUnit = null;
    }

    /*
     * Functions
     */

    /**
     * Fügt eine Unit hinzu.
     * @param {game.base.Unit} unit
     */
    addUnitStorageUnit(unit) {
        this._unitStorageUnits.add(unit);
        unit.spriteVisible = false;
        this.app.unitSelect.clearSelectUnits();
        this.trigger('storage.units.add', this, unit);
    }

    /**
     * Entfernt eine Unit.
     * @param {game.base.Unit} unit
     */
    removeUnitStorageUnit(unit) {
        this._unitStorageUnits.remove(unit);
        unit.spriteVisible = true;

        unit.setPosition(this.unit.portPosition);
        this.trigger('storage.units.remove', this, unit);
    }

    /**
     * Trifft zu wenn keine Unit enthalten ist.
     * @return {Boolean}
     */
    isUnitStorageEmpty() {
        return this._unitStorageUnits.length === 0;
    }

    /**
     * Trifft zu wenn die maximale Anzahl an Units vorhanden ist.
     * @return {Boolean}
     */
    isUnitStorageFull() {
        return this._maxUnitStorageUnits === this._unitStorageUnits.length;
    }

    /**
     * Ruft das freie Volumen ab.
     * @return {Number}
     */
    getFreeUnitStorageUnits() {
        return this._maxUnitStorageUnits - this._unitStorageUnits.length;
    }

    /*
     * Properties
     */

    /**
     * Ruft die erlaubten Units ab.
     * @return {Array<game.base.Unit>}
     */
    get unitStorageUnits() {
        return this._unitStorageUnits;
    }

    /**
     * Ruft die maximale Anzahl an Units ab.
     * @type {Number}
     */
    get maxUnitStorageUnits() {
        return this._maxUnitStorageUnits;
    }

    /**
     * Legt die maximale Anzahl an Units fest.
     * @param  {Number} value
     */
    set maxUnitStorageUnits(value) {
        this._maxUnitStorageUnits = value;
    }

    /**
     * Gibt an welche Units erlaubt sind.
     * @type {Array<game.types.unit>}
     */
    get allowedUnitStorageUnits() {
        return this._allowedUnitStorageUnits;
    }

    /**
     * Ruft die bevorzugte Storage-Unit ab.
     * @type {game.base.unit.Storage}
     */
    get unitStoragePreferredUnit() {
        return this._unitStoragePreferredUnit;
    }

    /**
     * Legt die bevorzugte Storage-Unit fest.
     * @param  {game.base.Unit} value
     */
    set unitStoragePreferredUnit(value) {
        this._unitStoragePreferredUnit = value;
    }

};
