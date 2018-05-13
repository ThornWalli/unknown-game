'use strict';

import Collection from '../Collection';

export default class UnitCollection extends Collection {

    /*
     * Functions
     */

    add(unit) {
        unit.on('remove', onUnitRemove, this);
        unit
            .on('change.direction', onUnitChangeDirection, this)
            .on('change.position', onUnitChangePosition, this)
            .on('render.sprite', onUnitRenderSprite, this)
            .on('change.active', onUnitChangeUnitActive, this);
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
        return UnitCollection;
    }
}


function onUnitChangeUnitActive(unit, active) {
    this.trigger('change.unit.active', unit, active);
}
function onUnitRenderSprite(unit) {
    this.trigger('render.unit.sprite', unit);
}

function onUnitRemove(unit) {
    this.remove(unit);
}

function onUnitChangeDirection(unit, direction) {
    this.trigger('change.unit.direction', unit, direction);
}

function onUnitChangePosition(unit, position, lastPosition) {
    this.trigger('change.unit.position', unit, position, lastPosition);
}
