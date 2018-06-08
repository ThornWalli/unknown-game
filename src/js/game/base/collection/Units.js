'use strict';

import Collection from '../Collection';

export default class Units extends Collection {

    /*
     * Functions
     */

    add(unit) {
        unit.on('remove', onUnitRemove, this);
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
        return Units;
    }
}

function onUnitRemove(unit) {
    this.remove(unit);
}
