'use strict';

import SyncPromise from 'sync-p';
import Collection from '../../../base/Collection';
import {
    GRID_CELL_TYPES
} from '../../../utils/matrix';
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
        this.app.unitSelect.removeSelectUnit(unit);
        this._unitStorageUnits.add(unit);

        unit.storage = this.unit;
        unit.visible = unit.active = false;
        unit.setPosition(this.unit.position);

        this.trigger('add.storage.units', this, unit);
    }

    /**
     * Entfernt eine Unit.
     * @param {game.base.Unit} unit
     */
    removeUnitStorageUnit(unit) {
        unit.storage = null;
        this._unitStorageUnits.remove(unit);

        let position = this.portPosition;
        if (GRID_CELL_TYPES.BLOCKED === this.app.map.isCellWalkable(position.x, position.y)) {
            position = this.app.map.getPositionAroundPosition(this.unit.position);
        }
        unit.setPosition(position);

        unit.visible = unit.active = true;

        this.trigger('remove.storage.units', this, unit);

    }

    removeAllUnitStorageUnits() {
        this._unitStorageUnits.forEach(unit => this.removeUnitStorageUnit(unit));
        return SyncPromise.resolve();
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
