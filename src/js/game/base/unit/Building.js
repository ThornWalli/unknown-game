'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Unit from '../Unit';
import Abstract_User from './abstract/User';
import Abstract_Sprite from './abstract/Sprite';
import Abstract_Neighbor from './abstract/Neighbor';

class Building extends Abstract_Neighbor(Abstract_Sprite(Abstract_User(Unit))) {
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
