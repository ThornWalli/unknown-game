'use strict';

import Size from '../base/Size';
import Test from '../Test';

import Wall from '../base/unit/Wall';
import Figure from '../base/unit/Figure';

import UnitSelect from '../UnitSelect';

export default class PathFinding extends Test {

    constructor(app) {
        super(app);
        this._unitSelect = new UnitSelect(app);
        // Events
        app.inputControl.on('pointerdown', onPointerDown, this);
    }

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
        return new Size(7, 7);
    }
}

function onPointerDown(event) {
    this._unitSelect.onPointerDown(event);
}


function createUnits(units) {

    let unit;

    unit = new Figure('Unit 1');
    unit.position.setValuesLocal(0, 4);
    unit.selectable = true;
    units.add(unit);

    createUnitWall(units);

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

function createUnit(x, y, type = Wall, name = '') {
    const unit = new type(name);
    unit.position.setValuesLocal(x, y);
    return unit;
}
