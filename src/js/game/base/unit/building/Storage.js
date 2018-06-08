'use strict';

import {
    // ITEMS,
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';


import Building from '../Building';

import Module_Storage from '../../../modules/unit/Storage';
import Abstract_ItemStorage from '../abstract/ItemStorage';
import Abstract_Module from '../abstract/Module';

const Extends = Abstract_Module(Abstract_ItemStorage(Building));
class Storage extends Extends {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT);
        this.setSprite(UNIT_TYPES.BUILDING.STORAGE.DEFAULT);
        this.setModule(Module_Storage);
        this.selectable = true;
        this.walkable = false;
    }
    onModuleReady(module) {
        Extends.prototype.onModuleReady.apply(this, arguments);
        module.maxItemStorageItemValue = 1000;
        // module.itemStorageItems[ITEMS.RESOURCE.WATER] = 200;
    }
}
UNIT_TYPES.BUILDING.STORAGE = {
    DEFAULT: 'building.storage.default'
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.STORAGE.DEFAULT] = Storage;
export default Storage;
