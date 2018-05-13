'use strict';

import {
    ITEMS,
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Container from '../Container';

class Food extends Container {
    constructor() {
        super();
        this.setType(UNIT_TYPES.CONTAINER.FOOD);
        this.setSprite(UNIT_TYPES.CONTAINER.FOOD);
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 30;
        module.itemStorageItems[ITEMS.FOOD.DEFAULT] = 30;
    }
}
UNIT_TYPES.CONTAINER.FOOD = 'container.food';
UNIT_CLASSES[UNIT_TYPES.CONTAINER.FOOD] = Food;
export default Food;
