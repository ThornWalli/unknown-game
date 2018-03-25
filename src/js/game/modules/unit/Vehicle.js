'use strict';

import Unit from '../Unit';

import Moveable from './abstract/Moveable';

import {
    UNITS as UNIT_TYPES
} from '../../types';

export default class Vehicle extends Moveable(Unit) {

    constructor(app, unit) {
        super(app, unit);
        this._vehiclePreferredDepotUnit = null;
    }

    /*
     * Functions
     */
    
    /**
     * Bewegt Unit zu angegebener Position.
     * @param  {game.base.Unit} unit
     * @param  {game.base.Position} position
     * @return {Promise}
     */
    moveToUnit(unit) {
        return this.moveToPosition(unit.portPosition);
    }

    /**
     * Unit bewegt sich zurück zu einem Storage
     * @return {Promise}
     */
    moveToDepot(depotUnit) {
        depotUnit = depotUnit || getPreferredDepot.bind(this)();
        if (!depotUnit) {
            this.log('Can\'t find Depot…');
            return Promise.resolve();
        } else {
            this.park(depotUnit);
        }
    }

    /*
     * Properties
     */

    /**
     * Ruft das bevorzugte Depot ab.
     * @return {game.base.Unit}
     */
    get vehiclePreferredDepotUnit() {
        return this._vehiclePreferredDepotUnit;
    }
    /**
     * Legt das bevorzugte Depot fest.
     * @param {game.base.Unit} value
     * @return {game.base.Unit}
     */
    set vehiclePreferredDepotUnit(value) {
        this._vehiclePreferredDepotUnit = value;
        this.trigger('vehiclePreferredDepotUnit.change', this, value);
    }

}



/**
 * Gibt ein freies bevorzugtes Depot zurück
 * @return {game.base.Unit}
 */
function getPreferredDepot() {
    const units = this.app.map.getUnitsByType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT);
    return units[0];
}
