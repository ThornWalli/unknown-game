'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class Home extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.HOME) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.HOME] = Home;
export default Home;
