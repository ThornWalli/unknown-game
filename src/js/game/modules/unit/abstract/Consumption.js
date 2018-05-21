'use strict';

import Events from '../../../base/Events';
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
        this.on('storage.value.add', onAddStorageValue, this);
    }

    /*
     * Functions
     */

    /**
     * Führt den Verbrauch für alle registrierten Verbaucher aus.
     */
    runConsumption() {
        let run = true;
        this.requiredItems(this._consumptions.filter(consumption => {
            if (consumption.value > 0 && consumption.capacity < consumption.capacity.value) {
                run = false;
            } else {
                consumption.capacity = Math.max(consumption.capacity - consumption.value, 0);
            }
            if (consumption.getCapacity() < 0.3) {
                return consumption;
            }
        }));
        return run;
    }

    getConsumption(type) {
        return this._consumptions.find(consumption => {
            if (consumption.type === type) {
                return consumption;
            }
        });
    }

    requiredItems(items) {
        console.log('required items :(', items);
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

class Consumption extends Events {
    constructor(type, maxCapacity, value) {
        super();
        this.type = type;
        this._capacity = 0;
        this.maxCapacity = maxCapacity;
        this.value = value;
    }
    getCapacity() {
        return this.capacity / this.maxCapacity;
    }

    get capacity() {
        return this._capacity;
    }
    set capacity(value) {
        this._capacity = Math.min(Math.max(value, 0), this.maxCapacity);
        this.trigger('change.capacity');
        if (this.isEmpty()) {
            this.trigger('empty');
        }
    }

    isEmpty() {
        return this.capacity === 0;
    }

    isWarning() {
        return this.capacity < 0.3;
    }
}

export {
    Consumption
};
