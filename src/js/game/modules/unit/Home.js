'use strict';

import Unit from '../Unit';
import ItemStorage from './abstract/ItemStorage';
import Harvester from '../../base/unit/bot/Harvester';

import {
    GRID_CELL_TYPES
} from '../../Matrix';

export default class Home extends ItemStorage(Unit) {
    constructor(app, unit) {
        super(app, unit);

       this._maxItemStorageValue = 1000;

        // console.log('Home', unit, app);

        // console.log(getPositionAroundPosition(unit.position), getFreePosition(unit.position, position => {
        //     return this.app.map.isCellWalkable(position.x, position.y) !== GRID_CELL_TYPES.BLOCKED;
        // }));

        // Stored units
        this._units = [];
        const harvesterUnit = createHarvesterUnit.bind(this)();
        harvesterUnit.position.setLocal(getFreePosition(unit.position, position => {
            return this.app.map.isCellWalkable(position.x, position.y) !== GRID_CELL_TYPES.BLOCKED;
        }));

        harvesterUnit.on('module.ready', onHarvesterModuleReady, this);
        this._units.push(harvesterUnit);
        this.app.map.units.add(harvesterUnit);

        this.app.unitSelect.selectUnit(harvesterUnit);

    }
}


function onHarvesterModuleReady(module) {
    this.log('Harvester created');
    module.home = this.unit;
    module.start();
}

function getFreePosition(position, func) {
    const positions = getPositionAroundPosition(position);
    for (var i = 0; i < positions.length; i++) {
        position = positions[i];
        if (func(position)) {
            return position;
        }
    }
    return false;
}

function getPositionAroundPosition(position) {
    const positions = [
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
    ];
    for (var i = 0; i < positions.length; i++) {
        positions[i] = position.addValues(positions[i][0], positions[i][1]);
    }
    return positions;
}


function createHarvesterUnit() {
    var unit = new Harvester();
    return unit;
}
