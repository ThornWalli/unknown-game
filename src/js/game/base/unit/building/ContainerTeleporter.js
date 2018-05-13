'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Building from '../Building';

import Module_Teleporter from '../../../modules/unit/Teleporter';
import Abstract_Module from '../abstract/Module';
import Abstract_ItemProduction from '../abstract/ItemProduction';
import Abstract_TELEPORTER from '../abstract/TELEPORTER';

class ContainerTeleporter extends Abstract_TELEPORTER(Abstract_ItemProduction(Abstract_Module(Building)) ){
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER);
        this.setSprite(UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER);
        this.setModule(Module_Teleporter);
        this.selectable = true;
        this.walkable = false;
        this.portOffset.setValuesLocal(0, 1);
    }
}
UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER = 'building.container_teleporter';
UNIT_CLASSES[UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER] = ContainerTeleporter;
export default ContainerTeleporter;
