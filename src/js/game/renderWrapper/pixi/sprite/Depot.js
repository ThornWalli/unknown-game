'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class Depot extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.DEPOT.DEFAULT) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.DEPOT.DEFAULT] = Depot;
export default Depot;
