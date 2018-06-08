'use strict';

import {
    // ITEMS,
    UNIT_CLASSES,
    UNITS_DATA,
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
        // module.addItemStorageItemValue(ITEMS.RESOURCE.WATER, module.maxItemStorageItemValue);
    }
}
UNIT_TYPES.BUILDING.STORAGE.CONTAINER = 'building.storage.container';
UNITS_DATA[UNIT_TYPES.BUILDING.STORAGE.CONTAINER] = {
    type: UNIT_TYPES.BUILDING.STORAGE.CONTAINER,
    title: 'Container (Lager)',
    description: 'Hier dienen Container zur einfachen lagerung von erlaubten dingen.',
    costs: {

    },
    energy: 0
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.STORAGE.CONTAINER] = Container;
export default Container;
