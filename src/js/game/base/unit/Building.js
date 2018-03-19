'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Unit from '../Unit';
import Abstract_Sprite from './abstract/Sprite';

class Building extends Abstract_Sprite(Unit) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.DEFAULT);
    }
}

UNIT_TYPES.BUILDING = {
    DEFAULT: 'building.default'
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.DEFAULT] = Building;
export default Building;
