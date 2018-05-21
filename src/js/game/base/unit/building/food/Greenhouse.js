'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../../types';

import Food from '../Food';

import Module_Greenhouse from '../../../../modules/unit/food/Greenhouse';
import Abstract_Module from '../../abstract/Module';
import Abstract_ItemStorage from '../../abstract/ItemStorage';
import Abstract_ItemProduction from '../../abstract/ItemProduction';
import Abstract_Consumption from '../../abstract/Consumption';

class Greenhouse extends Abstract_Consumption(Abstract_ItemProduction(Abstract_ItemStorage(Abstract_Module(Food)))) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.FOOD.GREENHOUSE);
        this.setSprite(UNIT_TYPES.BUILDING.FOOD.GREENHOUSE);
        this.setModule(Module_Greenhouse);
        this.selectable = true;
        this.walkable = false;
        this.portOffset.setValuesLocal(0, 1);
    }
    onModuleReady() {
    }
}
UNIT_TYPES.BUILDING.FOOD.GREENHOUSE = 'building.food.greenhouse';
UNIT_CLASSES[UNIT_TYPES.BUILDING.FOOD.GREENHOUSE] = Greenhouse;
export default Greenhouse;
