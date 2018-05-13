'use strict';

import {
    ITEMS
} from '../../../../types';

import Transporter from '../Transporter';

export default class Harvester extends Transporter {
    constructor(app, unit) {
        super(app, unit);
        this.name = 'harvester';
        this._transporterAvailableItemTypes = [ITEMS.RESOURCE.DEFAULT];
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

    afterUnloadItems(unit) {
        if (!this.unit.module.isItemStorageEmpty()) {
            return this.unloadItems(unit);
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
