'use strict';

import {
    ITEMS,
    UNIT_CLASSES,
    UNITS_DATA,
    UNITS as UNIT_TYPES
} from '../../../../types';

import Food from '../Food';

import Module_Greenhouse from '../../../../modules/unit/food/Greenhouse';
import Abstract_Module from '../../abstract/Module';
import Abstract_Action from '../../abstract/Action';
import Abstract_ItemStorage from '../../abstract/ItemStorage';
import Abstract_ItemProduction from '../../abstract/ItemProduction';
import Abstract_Consumption from '../../abstract/Consumption';

class Greenhouse extends Abstract_Consumption(Abstract_ItemProduction(Abstract_ItemStorage(Abstract_Action(Abstract_Module(Food))))) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.FOOD.GREENHOUSE);
        this.setSprite(UNIT_TYPES.BUILDING.FOOD.GREENHOUSE);
        this.setModule(Module_Greenhouse);
        this.selectable = true;
        this.walkable = false;
    }
    onModuleReady() {}
}
UNIT_TYPES.BUILDING.FOOD.GREENHOUSE = 'building.food.greenhouse';
UNITS_DATA[UNIT_TYPES.BUILDING.FOOD.GREENHOUSE] = {
    type: UNIT_TYPES.BUILDING.FOOD.GREENHOUSE,
    title: 'Gewächshaus (Nahrungproduktion)',
    description: 'Hier wird grünes zu Essen angebaut, braucht Wasser zum Produzieren.',
    energy: 0,
    costs: {

    },
    consumptions: [{
        type: ITEMS.RESOURCE.WATER,
        maxCapacity: 100,
        value: 20
    }]
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.FOOD.GREENHOUSE] = Greenhouse;
export default Greenhouse;
