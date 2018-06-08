'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Building from '../Building';

import Module_House from '../../../modules/unit/House';
import Abstract_Module from '../abstract/Module';

class House extends Abstract_Module(Building) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.HOUSE.DEFAULT);
        this.setSprite(UNIT_TYPES.BUILDING.HOUSE.DEFAULT);
        this.setModule(Module_House);
        this.selectable = true;
        this.walkable = false;
    }
    onModuleReady() {
    }
}
UNIT_TYPES.BUILDING.HOUSE = {
    DEFAULT: 'building.house.default'
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.HOUSE.DEFAULT] = House;
export default House;
