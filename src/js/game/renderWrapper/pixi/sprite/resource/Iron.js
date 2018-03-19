'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Resource from '../Resource';

class Iron extends Resource {
    constructor(unit, spriteType = UNIT_TYPES.RESOURCE.IRON) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.RESOURCE.IRON] = Iron;
export default Iron;
