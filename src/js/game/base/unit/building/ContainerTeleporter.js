'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Building from '../Building';

import Module_ContainerTeleporter from '../../../modules/unit/building/ContainerTeleporter';
import Abstract_Action from '../abstract/Action';
import Abstract_Module from '../abstract/Module';
import Abstract_ItemProduction from '../abstract/ItemProduction';
import Abstract_ItemStorage from '../abstract/ItemStorage';
import Abstract_Teleporter from '../abstract/Teleporter';

const Extends = Abstract_Action(Abstract_Teleporter(Abstract_ItemProduction(Abstract_ItemStorage(Abstract_Module(Building)))));
class ContainerTeleporter extends Extends {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER);
        this.setSprite(UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER);
        this.setModule(Module_ContainerTeleporter);
        this.selectable = true;
        this.walkable = false;
        this.portOffset.setValuesLocal(0, 1);
    }
    onModuleReady(module) {
        Extends.prototype.onModuleReady.apply(this, arguments);
        module.maxItemStorageItemValue = 200;
    }
}
UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER = 'building.container_teleporter';
UNIT_CLASSES[UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER] = ContainerTeleporter;
export default ContainerTeleporter;
