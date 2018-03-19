'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class Resource extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.RESOURCE.DEFAULT) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.RESOURCE.DEFAULT] = Resource;
export default Resource;
