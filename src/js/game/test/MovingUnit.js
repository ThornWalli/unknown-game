'use strict';

import Size from '../base/Size';
import Test from '../Test';
import Position from '../base/Position';
import Unit from '../Unit';
import MoveableUnit from '../unit/Moveable';

export default class MovingUnit extends Test {
    constructor(app) {
        super(app);
        // Events
        app.inputControl.on('pointerdown', onPointerDown, this);
        // Properties
        this._activeUnit = null;
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

    get activeUnit() {
        return this._activeUnit;
    }
    set activeUnit(unit) {
        if (this._activeUnit) {
            this._activeUnit.moveData = null;
            this._activeUnit.isSelected = false;
        }
        if (unit) {
            unit.isSelected = true;
        }
        this._activeUnit = unit;
    }

    get size() {
        return new Size(7, 7);
    }



}

// Pointer

function onPointerDown(event) {
    console.log('onPointerDown', event);
    const offset = this.display.getVisibleOffset();
    const x = Math.floor((event.x - offset.x) / this.map.cellSize.width),
        y = Math.floor((event.y - offset.y) / this.map.cellSize.height);

    const units = this.map.getUnitsByCell(x, y),
        unit = this.activeUnit;
    if (units.length > 0) {
        // select
        for (var i = 0; i < units.length; i++) {
            if (units[i].selectable) {
                this.activeUnit = units[i];
                break;
            }
        }
    } else if (unit) {
        // move

        console.log('movsadasdsadasde unit', unit);
        // get moveData
        const moveData = this.map.getMoveData(unit, new Position(x, y));
        // set moveData for move unit
        this.app.unitActions.add('move', moveData);
        // unit.move(moveData);

    }
    this.map.refresh();
}

function createUnits(units) {

    let unit;

    unit = new MoveableUnit('Unit 1');
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

function createUnit(x, y, type = Unit, name = '') {
    const unit = new type(name);
    unit.position.setValuesLocal(x, y);
    return unit;
}
