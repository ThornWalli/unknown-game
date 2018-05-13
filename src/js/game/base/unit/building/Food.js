'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Building from '../Building';
import Abstract_ItemProduction from '../abstract/ItemProduction';

class Food extends Abstract_ItemProduction(Building) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.FOOD.DEFAULT);
        this.setSprite(UNIT_TYPES.BUILDING.FOOD.DEFAULT);
    }
}
UNIT_TYPES.BUILDING.FOOD = {
    DEFAULT: 'building.food.default'
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.FOOD.DEFAULT] = Food;
export default Food;
