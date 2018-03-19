'use strict';

import Transporter from '../Transporter';
import {
    getNearUnitsByType
} from '../../../../utils/unit';


import {
    ITEMS,
    ACTIONS as ACTION_TYPES,
    UNITS as UNIT_TYPES
} from '../../../../types';

export default class Harvester extends Transporter {
    constructor(app, unit) {
        super(app, unit);
        this._harvesterPreferredStorageUnit = null;

        /*
         * TODO Frage ob überhaubt gebraucht?
         */
        this._harvesterPreferredStorageUnit = null;
        this._harvesterPreferredResourceUnit = null;

        this.unit.on('selected.change', (unit, selected) => {
            if (selected) {
                this.app.unitSelect.on('selectSecondary', (selectedUnits, position) => {
                    if (selectedUnits.indexOf(this.unit) > -1) {

                        const cellUnit = app.map.getUnitsByCell(position.x, position.y).filter(unit => {
                            if (!unit.isType(UNIT_TYPES.ROAD)) {
                                return true;
                            }
                        })[0];
                        if (cellUnit) {
                            if (cellUnit.isType(UNIT_TYPES.RESOURCE.DEFAULT)) {
                                this._harvesterPreferredResourceUnit = cellUnit.type;
                                return this.moveToResource(cellUnit);
                            } else if (cellUnit.isType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT)) {
                                return this.moveToDepot(cellUnit);
                            } else if (cellUnit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT)) {
                                return this.unloadItems(cellUnit);
                            }
                        }
                        this.moveToPosition(position);
                    }
                }, this);
            } else {
                this.app.unitSelect.off(null, null, this);
            }
        });


    }

    /*
     * Functions
     */


    start() {
        if (this.harvesterPreferredResourceUnit) {
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
    collectResources() {
        const units = getNearUnitsByType(this.app.map.units, this.unit.position, this.harvesterPreferredResourceUnit);
        if (units.length > 0) {
            this.log('Go to resource…');
            return this.moveToResource(units.shift().unit);
        } else {
            return this.unloadItems(this._harvesterPreferredStorageUnit);
        }
    }

    moveToResource(unit) {
        return this.moveToUnit(unit).then(() => {
            this.log('Collect resource…');
            return this.loadItems(unit);
        }).then(() => {
            if (this.unit.module.isItemStorageFull()) {
                // Ist voll und fährt zum Lager.
                this.log('Resource collected, go to Storage');
                return this.unloadItems(this._harvesterPreferredStorageUnit);
            } else {
                // Noch leer, sammelt weiter Ressourcen.
                this.log('Resource collected, go to next Resource');
                return this.collectResources();
            }
        });
    }

    /**
     * Unit bewegt sich zu einem Lager.
     * @return {Promise}
     */
    moveToStroage(storageUnit) {
        return this.moveToUnit(storageUnit || this._harvesterPreferredStorageUnit);
    }

    /**
     * Unit bewegt sich zurück zu einem Storage
     * @return {Promise}
     */
    moveToDepot(depotUnit) {
        depotUnit = depotUnit || getPreferredDepot.bind(this)();
        console.log('???', depotUnit);
        if (!depotUnit) {
            this.log('Can\'t find Depot…');
            return Promise.resolve();
        } else {
            return this.moveToUnit(depotUnit).then(() => {
                // Steht beim Depot.
                return this.app.unitActions.add({
                    type: ACTION_TYPES.PARK,
                    unit: this.unit,
                    startArgs: [depotUnit]
                });
            });
        }
    }

    /**
     * Bewegt Unit zu angegebener Position.
     * @param  {game.base.Unit} unit
     * @param  {game.base.Position} position
     * @return {Promise}
     */
    moveToPosition(position) {

        const hasAction = this.unit.activeAction;
        if (hasAction) {
            console.log('STOP?');
            this.unit.activeAction.stop();
            this.app.unitActions.clearActionsByUnit(this.unit);
        }
        const action = this.app.unitActions.add({
            type: ACTION_TYPES.MOVE,
            unit: this.unit,
            startArgs: [],
            beforeStart: (startArgs) => {
                return this.app.map.getMoveData(this.unit, position).then(moveData => {
                    if (moveData.path.length > 0) {
                        startArgs.push(moveData);
                        return startArgs;
                    } else {
                        console.log('Position ist belegt');
                        return false;
                    }
                });
            }
        });

        return action;
    }
    /**
     * Bewegt Unit zu angegebener Position.
     * @param  {game.base.Unit} unit
     * @param  {game.base.Position} position
     * @return {Promise}
     */
    moveToUnit(unit) {


        return this.moveToPosition(unit.portPosition);

        // if (this.unit.activeAction && this.unit.activeAction.type === 'move') {
        //     console.log('STOP?');
        //     this.app.unitActions.clearActionsByUnit(this.unit);
        //     this.unit.activeAction.stop();
        // }
        // return this.app.map.getMoveData(this.unit, ).then(moveData => {
        //     if (moveData.path.length > 0) {
        //         return this.app.unitActions.add({
        //             type: ACTION_TYPES.MOVE,
        //             unit: this.unit,
        //             startArgs: [moveData]
        //         });
        //     } else {
        //         // TODO PORT
        //         console.log('Position ist belegt');
        //     }
        // });
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
                    // Ist wieder entladen und sammelt weiter.
                    return this.collectResources();
                });
            });
        } else {
            this.log('Go to depot');
            this._harvesterPreferredResourceUnit = null;
            return this.moveToDepot();
        }
    }


    /*
     * Properties
     */


    get harvesterPreferredStorageUnit() {
        return this._harvesterPreferredStorageUnit;
    }
    set harvesterPreferredStorageUnit(value) {
        this._harvesterPreferredStorageUnit = value;
    }

    /**
     * Ruft das bevorzugte Rohstoff Item ab.
     * @return {game.types.types}
     */
    get harvesterPreferredResourceUnit() {
        return this._harvesterPreferredResourceUnit;
    }
    /**
     * Legt den bevorzugten Rohstoff Item fest.
     * @param {game.types.types} value
     * @return {game.types.types}
     */
    set harvesterPreferredResourceUnit(value) {
        this._harvesterPreferredResourceUnit = value;
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


/**
 * Gibt ein freies bevorzugtes Depot zurück
 * @return {game.base.Unit}
 */
function getPreferredDepot() {

    const units = this.app.map.getUnitsByType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT);
    return units[0];
}
