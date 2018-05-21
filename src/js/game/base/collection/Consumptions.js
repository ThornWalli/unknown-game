'use strict';

import Collection from '../Collection';

export default class Consumptions extends Collection {

    /*
     * Functions
     */

    add(unit) {
        this.addEventsForwarding('unit', unit);
        // unit
        //     .on('change.capacity', onConsumptionChangeCapacity, this);
        Collection.prototype.add.apply(this, arguments);
    }

    remove(unit, options = {}) {
        unit.off(null, null, this);
        Collection.prototype.remove.apply(this, arguments);
        if (!options.passive) {
            unit.destroy();
        }
    }

    getByType(type) {
        return this.filter(unit => {
            if (unit.type === type) {
                return type;
            }
        });
    }

    /*
     * Properties
     */

    get class() {
        return Consumptions;
    }
}


function onConsumptionChangeCapacity(unit, active) {
    this.trigger('change.consumption.capacity', unit, active);
}
