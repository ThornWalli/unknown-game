'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';


import Building from '../Building';

import Module_Storage from '../../../modules/unit/Storage';
import Abstract_ItemStorage from '../abstract/ItemStorage';
import Abstract_Module from '../abstract/Module';

class Storage extends Abstract_Module(Abstract_ItemStorage(Building)) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT);
        this.setSprite(UNIT_TYPES.BUILDING.STORAGE.DEFAULT);
        this.setModule(Module_Storage);
        this.selectable = true;
        this.walkable = false;
        this.portOffset.setValuesLocal(0, 1);
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 1000;
    }
}
UNIT_TYPES.BUILDING.STORAGE = {
    DEFAULT: 'building.storage.default'
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.STORAGE.DEFAULT] = Storage;
export default Storage;
