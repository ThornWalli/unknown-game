'use strict';

import {
    ITEMS,
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Resource from '../Resource';

class Copper extends Resource {
    constructor() {
        super();
        this.setType(UNIT_TYPES.RESOURCE.COPPER);
        this.setSprite(UNIT_TYPES.RESOURCE.COPPER);
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 30;
        module.itemStorageItems[ITEMS.RESOURCE.COPPER] = 30;
    }
}
UNIT_TYPES.RESOURCE.COPPER = 'resource.copper';
UNIT_CLASSES[UNIT_TYPES.RESOURCE.COPPER] = Copper;
export default Copper;
