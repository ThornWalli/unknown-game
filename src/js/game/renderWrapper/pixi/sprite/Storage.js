'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class Storage extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.STORAGE.DEFAULT) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.STORAGE.DEFAULT] = Storage;
export default Storage;
