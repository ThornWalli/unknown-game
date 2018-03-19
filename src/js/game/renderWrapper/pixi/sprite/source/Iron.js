'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Source from '../Source';

class Iron extends Source {
    constructor(unit, spriteType = UNIT_TYPES.SOURCE.IRON) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.SOURCE.IRON] = Iron;
export default Iron;
