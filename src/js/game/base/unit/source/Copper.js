'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Source from '../Source';

class Copper extends Source {
    constructor() {
        super();
        this.setType(UNIT_TYPES.SOURCE.COPPER);
        this.setSprite(UNIT_TYPES.SOURCE.COPPER);
    }
    onModuleReady(module) {
        module.spawnUnitClass = UNIT_CLASSES[UNIT_TYPES.RESOURCE.COPPER];
    }
}
UNIT_TYPES.SOURCE.COPPER = 'source.copper';
UNIT_CLASSES[UNIT_TYPES.SOURCE.COPPER] = Copper;
export default Copper;
