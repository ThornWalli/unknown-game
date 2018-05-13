'use strict';

import Unit from '../Unit';

import Moveable from './abstract/Moveable';
import SyncPromise from 'sync-p/extra';

import {
    UNITS as UNIT_TYPES
} from '../../types';


import {
    ACTIONS as ACTION_TYPES
} from '../../types';

const Extends = Moveable(Unit);
export default class Vehicle extends Extends {

    constructor(app, unit) {
        super(app, unit);
        this._vehiclePreferredDepotUnit = null;
    }

    /*
     * Functions
     */

    onSelectSecondary(unit) {
        if (unit && unit.isType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT)) {
            return this.moveToDepot(unit);
        } else if (!Unit.prototype.onSelectSecondary.apply(this, arguments)) {
            return Extends.prototype.onSelectSecondary.apply(this, arguments);
        }
    }

    /**
     * Bewegt Unit zu angegebener Position.
     * @param  {game.base.Unit} unit
     * @param  {game.base.Position} position
     * @return {Promise}
     */
    moveToUnit(unit) {
        let promise;
        if (this.unit.storage) {
            promise = this.unpark();
        } else {
            promise = SyncPromise.resolve();
        }
        return promise.then(() => {
            return this.moveToPosition(unit.portPosition);
        });
    }

    /**
     * Unit bewegt sich zurück zu einem Storage
     * @return {Promise}
     */
    moveToDepot(depotUnit) {
        depotUnit = depotUnit || getPreferredDepot.bind(this)();
        this.log('Go to depot');
        if (!depotUnit) {
            this.log('Can\'t find Depot…');
            return Promise.resolve();
        } else {
            return this.park(depotUnit);
        }
    }


    park(unit) {
        if (!unit.activeAction || unit.activeAction.type !== ACTION_TYPES.PARK) {
            return this.moveToUnit(unit).then(() => {
                console.log('jooo');
                // Steht beim Depot.
                return this.app.unitActions.add({
                    type: ACTION_TYPES.PARK,
                    unit: this.unit,
                    startArgs: [unit]
                });
            });
        } else {
            console.log('BAAAAAM');
        }
    }

    unpark() {
        this.unit.storage.module.removeUnitStorageUnit(this.unit);
        this.unit.module.start();
        return SyncPromise.resolve();
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
