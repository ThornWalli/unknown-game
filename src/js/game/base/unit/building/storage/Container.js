'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../../types';

import Storage from '../Storage';

class Container extends Storage {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.STORAGE.CONTAINER);
        this.setSprite(UNIT_TYPES.BUILDING.STORAGE.CONTAINER);
    }
    onModuleReady(module) {
        Storage.prototype.onModuleReady.apply(this, arguments);
        module.maxItemStorageItemValue = 15;
    }
}
UNIT_TYPES.BUILDING.STORAGE.CONTAINER = 'building.storage.container';
UNIT_CLASSES[UNIT_TYPES.BUILDING.STORAGE.CONTAINER] = Container;
export default Container;
