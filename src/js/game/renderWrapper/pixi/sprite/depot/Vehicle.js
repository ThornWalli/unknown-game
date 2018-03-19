'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Depot from '../Depot';

class Vehicle extends Depot {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.DEPOT.VEHICLE) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.DEPOT.VEHICLE] = Vehicle;
export default Vehicle;
