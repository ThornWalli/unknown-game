'use strict';

import {
    ITEMS
} from '../../../../types';

import {
    getNearUnitsByItemType
} from '../../../../utils/unit';

import Transporter from '../Transporter';

export default class Harvester extends Transporter {
    constructor(app, unit) {
        super(app, unit);
        this.name = 'harvester';
        this._transporterAvailableItemTypes = [ITEMS.RESOURCE.DEFAULT];
        this._transporterIgnoredUnitTypes = [];
    }

    /*
     * Functions
     */

    start() {
        if (this.transporterPreferredItemType) {
            return this.collectItems().catch(err => {
                console.error(err);
                throw err;
            });
        }
    }


    /**
     * Startet zum einsammeln von Rohstoffen.
     * @return {Promise}
     */
    collectItems(itemType) {
        if (!this.isItemStorageFull()) {

            itemType = itemType || this.transporterPreferredItemType || (this._transporterAvailableItemTypes ? this._transporterAvailableItemTypes[0] : null);
            // console.log('collectItems', type || this.transporterPreferredItemType);
            const units = getNearUnitsByItemType(this.app.map.units, this.unit.position, itemType);

            let unit = null;

            // Eine nicht volle Resource wird bevorzugt.
            units.forEach(data => {
                if (!unit || data.unit.module.getItemStorageItemValue(itemType) < unit.module.getItemStorageItemValue(itemType)) {
                    unit = data.unit;
                }
            });

            if (units.length > 0) {
                this.log('Go to resource…');
                if (!unit) {
                    unit = units.shift().unit;
                }
                if (!unit.module.isItemStorageEmpty()) {
                    return this.moveToResource(unit);
                }
            }
        }

        return Transporter.prototype.collectItems.apply(this, arguments);
    }

    afterUnloadItemsToStorage(unit) {
        if (!this.unit.module.isItemStorageEmpty()) {
            return this.unloadItemsToStorage(unit);
        } else {
            // Ist wieder entladen und sammelt weiter.
            return this.collectItems();
        }
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
//         return this.collectItems();
//     } else {
//         return this.app.unitActions.add(this.unit, 'transfer', unit, this._resourceType, this.getFreeStorageValue(), true);
//     }
// }
//
