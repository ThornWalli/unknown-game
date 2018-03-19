'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Unit from '../Unit';
import Abstract_Road from './abstract/Road';
import Abstract_Sprite from './abstract/Sprite';

class Road extends Abstract_Sprite(Abstract_Road(Unit)) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.ROAD.DEFAULT);
        this.selectable = false;
        this.walkable = true;

    }
}

UNIT_TYPES.ROAD = {
    DEFAULT: 'road.default'
};
UNIT_CLASSES[UNIT_TYPES.ROAD.DEFAULT] = Road;
export default Road;
