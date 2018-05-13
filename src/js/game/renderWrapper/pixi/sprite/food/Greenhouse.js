'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Sprite from '../../Sprite';

class Greenhouse extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.FOOD.GREENHOUSE) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.FOOD.GREENHOUSE] = Greenhouse;
export default Greenhouse;
