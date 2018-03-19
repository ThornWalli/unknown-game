'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Unit from '../Unit';

import Abstract_Spawn from './abstract/Spawn';

export default class Source extends Abstract_Spawn(Unit) {

    constructor(app, unit) {
        super(app, unit);

        this.spawnRadius = 3;
        this.spawnUnitClass = UNIT_CLASSES[UNIT_TYPES.RESOURCE.IRON];
        this.startSpawn();
    }

}


// function getFreePosition() {
//     if (this.app.mapp.getUnitsByCell(position.x, position.y).length > 0) {
//         if (hasFreePositionAroundPosition(this.unit.position)) {
//             return getFreePosition();
//         } else {
//             return null;
//         }
//     } else {
//         return position;
//     }
// }
