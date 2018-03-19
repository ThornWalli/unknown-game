'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class Source extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.SOURCE.DEFAULT) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.SOURCE.DEFAULT] = Source;
export default Source;
