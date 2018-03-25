'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Bot from './Bot';
import Sprite from './abstract/Sprite';

class Vehicle extends Sprite(Bot) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.VEHICLE.DEFAULT);
        this.selectable = true;
        this._vehiclePreferredDepotUnit = null;
    }

    /**
     * Ruft das bevorzugte Depot ab.
     * @return {game.types.types}
     */
    get vehiclePreferredDepotUnit() {
        return this._vehiclePreferredDepotUnit;
    }
    /**
     * Legt das bevorzugte Depot fest.
     * @param {game.types.types} value
     * @return {game.types.types}
     */
    set vehiclePreferredDepotUnit(value) {
        this._vehiclePreferredDepotUnit = value;
        this.trigger('vehiclePreferredDepotUnit.change', this, value);
    }
}

UNIT_TYPES.VEHICLE = {
    DEFAULT: 'vehicle.default'
};
UNIT_CLASSES[UNIT_TYPES.VEHICLE.DEFAULT] = Vehicle;
export default Vehicle;
