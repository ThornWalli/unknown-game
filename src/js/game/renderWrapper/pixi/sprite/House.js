'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class House extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.HOUSE.DEFAULT) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.HOUSE.DEFAULT] = House;
export default House;
