'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Source from '../Source';

class Iron extends Source {
    constructor() {
        super();
        this.setType(UNIT_TYPES.SOURCE.IRON);
        this.setSprite(UNIT_TYPES.SOURCE.IRON);
    }
    onModuleReady(module) {
        module.spawnUnitClass = UNIT_CLASSES[UNIT_TYPES.RESOURCE.IRON];
    }
}
UNIT_TYPES.SOURCE.IRON = 'source.iron';
UNIT_CLASSES[UNIT_TYPES.SOURCE.IRON] = Iron;
export default Iron;
