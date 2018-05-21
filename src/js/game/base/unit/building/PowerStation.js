'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Building from '../Building';
import Abstract_ItemProduction from '../abstract/ItemProduction';
import Abstract_PowerStation from '../abstract/PowerStation';

class Food extends Abstract_PowerStation(Abstract_ItemProduction(Building)) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.POWER_STATION.DEFAULT);
        this.setSprite(UNIT_TYPES.BUILDING.POWER_STATION.DEFAULT);
        this.selectable = true;
    }
}
UNIT_TYPES.BUILDING.POWER_STATION = {
    DEFAULT: 'building.power_station.default'
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.POWER_STATION.DEFAULT] = Food;
export default Food;
