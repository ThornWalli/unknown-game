'use strict';

import Transporter from '../Transporter';
import {
    getNearUnitsByType,
    TYPES as UNIT_TYPES
} from '../../../../utils/unit';


const RESOURCES = {
    IRON: 'iron'
};

export default class Harvester extends Transporter {
    constructor(app, unit) {
        super(app, unit);
        this.home = null;
        this._maxItemStorageValue = 20;
        this._resourceType = RESOURCES.IRON;
    }

    start() {
        return this.collectResources().catch(err => {
            console.error(err);
            throw err;
        });
    }

    /**
     * Startet zum einsammeln von Rohstoffen.
     * @return {Promise}
     */
    collectResources() {

        const units = getNearUnitsByType(this.app.map.units, this.unit.position, UNIT_TYPES.RESOURCE);
        if (units.length > 0) {
            this.log('Go to resource…');
            const resourceUnit = units.shift().unit;
            return this.moveUnitToPosition(this.unit, resourceUnit.position).then(() => {
                this.log('Collect resource…');
                return loadItems.bind(this)(resourceUnit);
            }).then(() => {
                if (this.unit.module.isItemStorageFull()) {
                    // Ist voll und fährt zum Lager.
                    this.log('Resource collected, go to Home');
                    return unloadItems.bind(this)(this.home);
                } else {
                    // Noch leer, sammelt weiter Ressourcen.
                    this.log('Resource collected, go to next Resource');
                    return this.collectResources();
                }
            });
        } else {
            return unloadItems.bind(this)(this.home);
        }
    }

    /**
     * Unit bewegt sich zu einem Lager.
     * @return {Promise}
     */
    moveToHome() {
        return this.moveUnitToPosition(this.unit, this.home.position);
    }
    /**
     * Unit bewegt sich zurück zu einem Storage
     * @return {Promise}
     */
    moveToDepot() {
        const depotUnit = getPreferredDepot.bind(this)();
        return this.moveUnitToPosition(this.unit, depotUnit.position).then(() => {
            // Steht beim Depot.
            return this.app.unitActions.add(this.unit, 'park', depotUnit);
        });
    }

    /**
     * Bewegt Unit zu angegebener Position.
     * @param  {game.base.Unit} unit
     * @param  {game.base.Position} position
     * @return {Promise}
     */
    moveUnitToPosition(unit, position) {


        // get moveData
        // set moveData for move unit
        // if (unit.activeAction && unit.activeAction.type === 'move') {
        //     unit.activeAction.stop();
        // }

        return this.app.map.getMoveData(unit, position).then(moveData => {
            if (moveData.path.length > 0) {
                return this.app.unitActions.add(unit, 'move', moveData);
            } else {
                console.log('Position ist belegt');
            }
        });
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

    const units = this.app.map.getUnitsByType(UNIT_TYPES.BUILDING.DEPOT);
    return units[0];
}

/**
 * Zieht Rohstoffe von der angegebenen Unit ab.
 * @param  {game.base.Unit} unit
 * @return {Promise}
 */
function loadItems(unit) {
    if (unit.module.isItemStorageEmpty()) {
        // Resource is empty
        return this.collectResources();
    } else {
        return this.app.unitActions.add(this.unit, 'transfer', unit, this._resourceType, this.getFreeStorageValue(), true);
    }
}

/**
 * Transferiert Rohstoffe zur angegebenen Unit.
 * @param  {game.base.Unit} unit
 * @return {Promise}
 */
function unloadItems(unit) {
    if (!this.unit.module.isItemStorageEmpty()) {
        return this.moveToHome().then(() => {
            // Ist beim Lager und entleert sich.
            console.log('entladen', this._resourceType, this.getStorageItemValue(this._resourceType));
            return this.app.unitActions.add(this.unit, 'transfer', unit, this._resourceType, this.getStorageItemValue(this._resourceType)).then(() => {
                // Ist wieder entladen und sammelt weiter.
                return this.collectResources();
            });
        });
    } else {
        return this.moveToDepot();
    }
}
