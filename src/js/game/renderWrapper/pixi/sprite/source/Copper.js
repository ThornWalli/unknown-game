'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Source from '../Source';

class Copper extends Source {
    constructor(unit, spriteType = UNIT_TYPES.SOURCE.COPPER) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.SOURCE.COPPER] = Copper;
export default Copper;
