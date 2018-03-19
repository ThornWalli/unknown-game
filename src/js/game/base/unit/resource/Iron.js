'use strict';

import {
    ITEMS,
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Resource from '../Resource';

class Iron extends Resource {
    constructor() {
        super();
        this.setType(UNIT_TYPES.RESOURCE.IRON);
        this.setSprite(UNIT_TYPES.RESOURCE.IRON);
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 10;
        module.itemStorageItems[ITEMS.RESOURCE.IRON] = 10;
    }
}
UNIT_TYPES.RESOURCE.IRON = 'resource.iron';
UNIT_CLASSES[UNIT_TYPES.RESOURCE.IRON] = Iron;
export default Iron;
