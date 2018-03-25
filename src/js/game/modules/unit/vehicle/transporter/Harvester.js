'use strict';

import Transporter from '../Transporter';
import {
    getNearUnitsByType
} from '../../../../utils/unit';


import {
    ACTIONS as ACTION_TYPES,
    UNITS as UNIT_TYPES
} from '../../../../types';

export default class Harvester extends Transporter {
    constructor(app, unit) {
        super(app, unit);

        this._harvesterPreferredResourceType = null;


    }

    /*
     * Functions
     */

    onSelectSecondary(unit) {
        if (unit) {
            if (unit.isType(UNIT_TYPES.RESOURCE.DEFAULT)) {
                this.harvesterPreferredResourceType = unit.type;
                return this.moveToResource(unit);
            } else if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT)) {
                return this.unloadItems(unit);
            }
        }
        return Transporter.prototype.onSelectSecondary.apply(this, arguments);
    }


    start() {
        if (this.harvesterPreferredResourceType) {
            return this.collectResources().catch(err => {
                console.error(err);
                throw err;
            });
        }
    }

    /**
     * Startet zum einsammeln von Rohstoffen.
     * @return {Promise}
     */
    collectResources(type) {
        const units = getNearUnitsByType(this.app.map.units, this.unit.position, type || this.harvesterPreferredResourceType);
        if (units.length > 0) {
            this.log('Go to resource…');
            return this.moveToResource(units.shift().unit);
        } else {
            return this.unloadItems(this.transporterPreferredStorageUnit);
        }
    }

    moveToResource(unit) {
        if (this.unit.module.isItemStorageFull()) {
            // Ist voll und fährt zum Lager.
            this.log('Resource collected, go to Storage');
            return this.unloadItems(this.transporterPreferredStorageUnit);
        } else {
            return this.moveToUnit(unit).then(() => {
                this.log('Collect resource…');
                return this.loadItems(unit);
            }).then(() => {
                // Noch leer, sammelt weiter Ressourcen.
                this.log('Resource collected, go to next Resource');
                return this.collectResources();
            });
        }
    }

    park(unit) {
        if (!unit.activeAction || unit.activeAction.type !== ACTION_TYPES.PARK) {
            return this.moveToUnit(unit).then(() => {
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


    /**
     * Zieht Rohstoffe von der angegebenen Unit ab.
     * @param  {game.base.Unit} unit
     * @return {Promise}
     */
    loadItems(unit) {
        if (unit.module.isItemStorageEmpty()) {
            // Resource is empty
            return this.collectResources();
        } else {
            const resourceType = unit.module.getItemStorageAvailableItems(this.allowedItemStorageItems).shift();
            if (!resourceType) {
                console.error('Kein Rohstoff vorhanden');
            }
            this.log('Load resources…');
            return this.app.unitActions.add({
                type: ACTION_TYPES.TRANSFER,
                unit: this.unit,
                startArgs: [unit, resourceType, this.getFreeItemStorageValue(), true]
            });
        }
    }

    /**
     * Transferiert Rohstoffe zur angegebenen Unit.
     * @param  {game.base.Unit} unit
     * @return {Promise}
     */
    unloadItems(unit) {
        if (!this.unit.module.isItemStorageEmpty()) {
            return this.moveToStroage().then(() => {
                // Ist beim Lager und entleert sich.
                const resourceType = this.unit.module.getItemStorageAvailableItems(this.allowedItemStorageItems).shift();
                if (!resourceType) {
                    console.error('Kein Rohstoff vorhanden');
                }
                this.log('Unload resources…');
                return this.app.unitActions.add({
                    type: ACTION_TYPES.TRANSFER,
                    unit: this.unit,
                    startArgs: [unit, resourceType, this.getItemStorageItemValue(resourceType)]
                }).then(() => {
                    if (!this.unit.module.isItemStorageEmpty()) {
                        this.unloadItems(unit);
                    } else {
                        // Ist wieder entladen und sammelt weiter.
                        return this.collectResources();
                    }
                });
            });
        } else {
            this.log('Go to depot');
            this._harvesterPreferredResourceType = null;
            return this.moveToDepot();
        }
    }


    /*
     * Properties
     */

    /**
     * Ruft den bevorzugte Rohstoff Typ ab.
     * @return {game.types.types}
     */
    get harvesterPreferredResourceType() {
        return this._harvesterPreferredResourceType;
    }
    /**
     * Legt den bevorzugten Rohstoff Typ fest.
     * @param {game.types.types} value
     * @return {game.types.types}
     */
    set harvesterPreferredResourceType(value) {
        this._harvesterPreferredResourceType = value;
        this.trigger('harvesterPreferredResourceType.change', this, value);
    }
}

/*
 * Functions
 */


// /**
//  * Startet zum Depot.
//  * @return {Promise}
//  */
// function moveToDepot() {
//     if (unit.module.isItemStorageEmpty()) {
//         // Resource is empty
//         return this.collectResources();
//     } else {
//         return this.app.unitActions.add(this.unit, 'transfer', unit, this._resourceType, this.getFreeStorageValue(), true);
//     }
// }
//
