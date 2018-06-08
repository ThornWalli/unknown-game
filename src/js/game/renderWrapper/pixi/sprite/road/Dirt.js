'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Road from '../Road';

class Dirt extends Road {
    constructor(unit, spriteType = UNIT_TYPES.ROAD.DIRT) {
        super(unit, spriteType);

    }
}

SPRITE_CLASSES[UNIT_TYPES.ROAD.DIRT] = Dirt;
export default Dirt;
