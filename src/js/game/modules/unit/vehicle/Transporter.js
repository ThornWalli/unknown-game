'use strict';

import Vehicle from '../Vehicle';
import ItemStorage from '../abstract/ItemStorage';

import {
    UNITS as UNIT_TYPES
} from '../../../types';

export default class Transporter extends ItemStorage(Vehicle) {

    constructor(app, unit) {
        super(app, unit);
        this.maxItemStorageItemValue = 50;
        this._transporterPreferredStorageUnit = null;
    }

    /*
     * Functions
     */

    onSelectSecondary(unit) {
        if (unit && unit.isType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT)) {
            return this.moveToDepot(unit);
        }
        Vehicle.prototype.onSelectSecondary.apply(this, arguments);
    }

    /**
     * Unit bewegt sich zu einem Lager.
     * @return {Promise}
     */
    moveToStroage(storageUnit) {
        return this.moveToUnit(storageUnit || this._transporterPreferredStorageUnit);
    }

    /*
     * Properties
     */

    /**
     * Ruft das bevorzugte Lager ab.
     * @return {game.base.Unit}
     */
    get transporterPreferredStorageUnit() {
        return this._transporterPreferredStorageUnit;
    }
    /**
     * Legt das bevorzugte Lager fest.
     * @param {game.base.Unit} value
     * @return {game.base.Unit}
     */
    set transporterPreferredStorageUnit(value) {
        this._transporterPreferredStorageUnit = value;
        this.trigger('transporterPreferredStorageUnit.change', this, value);
    }

}
