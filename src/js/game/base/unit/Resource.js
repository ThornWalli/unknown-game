'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import ResourceModule from '../../modules/unit/Resource';

import Unit from '../Unit';
import Abstract_Sprite from './abstract/Sprite';
import Abstract_Module from './abstract/Module';

class Resource extends Abstract_Sprite(Abstract_Module(Unit)) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.RESOURCE.DEFAULT);
        this.setModule(ResourceModule);
        this.selectable = true;
        this.walkable = true;
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 10;
    }
    // get walkable() {
    //     return this._walkable;
    // }
    // set walkable(walkable) {
    //     walkable = true;
    //     this._walkable = walkable;
    // }
}
UNIT_TYPES.RESOURCE.DEFAULT = 'resource.default';
UNIT_CLASSES[UNIT_TYPES.RESOURCE.DEFAULT] = Resource;

export default Resource;
