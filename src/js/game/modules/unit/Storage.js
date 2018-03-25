'use strict';

import Unit from '../Unit';
import ItemStorage from './abstract/ItemStorage';
import Grabber from '../../base/unit/vehicle/harvester/Grabber';

import {
    GRID_CELL_TYPES
} from '../../Matrix';

export default class Storage extends ItemStorage(Unit) {
    constructor(app, unit) {
        super(app, unit);

        // Stored units
        this._units = [];
        const harvesterUnit = createHarvesterUnit.bind(this)();
        harvesterUnit.position.setLocal(getFreePosition(unit.position, position => {
            return this.app.map.isCellWalkable(position.x, position.y) !== GRID_CELL_TYPES.BLOCKED;
        }));

        harvesterUnit.on('module.ready', onHarvesterModuleReady, this);
        this._units.push(harvesterUnit);
        this.app.map.units.add(harvesterUnit);

        // this.app.unitSelect.selectUnit(harvesterUnit);

    }
}


function onHarvesterModuleReady(module) {
    this.log('Harvester created');
    module.transporterPreferredStorageUnit = this.unit;
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
    var unit = new Grabber();
    return unit;
}
