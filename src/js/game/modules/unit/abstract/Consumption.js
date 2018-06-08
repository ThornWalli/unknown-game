'use strict';

import {
    UNITS_DATA
} from '../../../types';

import Consumption from '../../../base/Consumption';
import Consumptions from '../../../base/collection/Consumptions';

/**
 * Abstract Class Module
 * @class Consumption
 */
export default Abstract => class extends Abstract {

    constructor(app, unit) {
        super(app, unit);
        this._consumptions = new Consumptions();
        this.addEventsForwarding('consumptions', this._consumptions);
        this
            .on('storage.value.add', onAddStorageValue, this)
            .on('consumptions.add', this.onAddConsumption, this)
            .on('consumptions.item.warning', this.onWarningConsumption, this)
            .on('consumptions.item.empty', this.onEmptyConsumption, this);

console.log('UNITS_DATA[this.unit.type]',UNITS_DATA[this.unit.type].consumptions);
        UNITS_DATA[this.unit.type].consumptions.forEach(consumption => {
            console.log('consumptionconsumptionconsumption',consumption);
            this._consumptions.add(new Consumption(consumption.type, consumption.maxCapacity, consumption.value, {
                warningMinValues: 3
            }));
        });
    }

    /*
     * Functions
     */

    /**
     * Führt den Verbrauch für alle registrierten Verbaucher aus.
     */
    runConsumption() {
        if (this.canConsumption()) {
            this._consumptions.filter(consumption => {
                consumption.capacity = Math.max(consumption.capacity - consumption.value, 0);
            });
            return true;
        }
        return false;
    }

    canConsumption() {
        return !this._consumptions.find(consumption => !consumption.check());
    }

    getConsumption(type) {
        return this._consumptions.find(consumption => {
            if (consumption.type === type) {
                return consumption;
            }
        });
    }

    onAddConsumption(consumption) {
        // consumption.check();
    }
    onWarningConsumption(consumption) {
        console.log('consumption warning :(', consumption);
    }
    onEmptyConsumption(consumption) {
        console.log('consumption empty :(', consumption);
    }

    /*
     * Properties
     */

    get consumptions() {
        return this._consumptions;
    }

};

function onAddStorageValue(itemStorage, type, value) {
    const consumption = this.getConsumption(type);
    if (consumption) {
        consumption.capacity = consumption.capacity + value;
        this.removeItemStorageItemValue(type, value);
    }
}
