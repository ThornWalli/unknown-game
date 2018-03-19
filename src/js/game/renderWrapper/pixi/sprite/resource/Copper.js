'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Resource from '../Resource';

class Copper extends Resource {
    constructor(unit, spriteType = UNIT_TYPES.RESOURCE.COPPER) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.RESOURCE.COPPER] = Copper;
export default Copper;
