'use strict';

import Size from '../base/Size';
import Test from '../Test';
import Unit from '../base/Unit';

export default class PathFinding extends Test {

    /*
     * Functions
     */

    start() {
        // Create Units
        createUnits(this.units);
        this.map.refresh();
    }

    /*
     * Properties
     */

    get size() {
        return new Size(7, 7);
    }
    get visibleSize() {
        return new Size(3, 3);
    }
}


function createUnits(units) {
    createUnitWall(units);
}

function createUnit(x, y, type, name = '') {
    type = type || Unit;
    const unit = new type(name);
    unit.position.setValuesLocal(x, y);
    return unit;
}


function createUnitWall(units) {
    let unit;
    const ignore = [2];
    for (let i = 0; i < 7; i++) {
        if (ignore.indexOf(i) === -1) {
            unit = createUnit(3, i);
            unit.walkable = false;
            units.add(unit);
        }
    }
    for (let i = 0; i < 2; i++) {
        unit = createUnit(4 + i, 4);
        unit.walkable = false;
        units.add(unit);
    }
}
