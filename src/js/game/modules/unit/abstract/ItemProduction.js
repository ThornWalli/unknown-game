'use strict';


import {
    ACTIONS as ACTION_TYPES
} from '../../../types';

const CONSUMPTION_WAIT_ITEMS_DELAY = 10; // Seconds

/**
 * Abstract Class Module
 * @class ItemProduction
 */
export default Abstract => class extends Abstract {

    constructor(app, unit) {
        super(app, unit);
        this._itemProductionTickerListener = null;
        this._productionItems = [];
        this._itemProductionDuration = 60 * 1;

    }

    /*
     * Functions
     */

    startItemProduction(wait) {
        if (!this.unit.isSetToRemove()) {
            let duration = this._itemProductionDuration;
            if (wait) {
                duration = CONSUMPTION_WAIT_ITEMS_DELAY;
            }
            this._itemProductionStopped = false;
            return this.app.unitActions.add({
                type: ACTION_TYPES.WAIT,
                unit: this.unit,
                startArgs: [duration * 1000]
            }).then(() => {
                return this.onItemProduction();
            });
        }
    }

    stopItemProduction() {
        this._itemProductionStopped = true;
    }

    /*
     * Properties
     */

    get productionItems() {
        return this._productionItems;
    }

    /*
     * Events
     */

    onItemProduction() {
        let waiting = false;

        if (this.totalItemStorageValue >= this.maxItemStorageItemValue * (1 / 3)) {
            waiting = true;
            // Storage ist voll
            this.requestTransporterToEmpty();
        }

        if (!waiting) {
            if (this.runConsumption()) {
                // Hat Produziert
                this._productionItems.forEach(item => {
                    if (this.addItemStorageItemValue(item, 10) === 0) {
                        // Lager ist voll, kann nicht weiter produzieren
                        waiting = true;
                    }
                });
            } else {
                // Kann nicht prodzieren, nicht genug rohstoffe
                waiting = true;
            }
        }

        return this.startItemProduction(waiting);

    }

};
