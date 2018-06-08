'use strict';

import {
    UNIT_CLASSES,
    UNITS_DATA,
    UNITS as UNIT_TYPES
} from '../../types';

import Unit from '../Unit';
import Abstract_User from './abstract/User';
import Abstract_Road from './abstract/Road';
import Abstract_Sprite from './abstract/Sprite';
import Abstract_Neighbor from './abstract/Neighbor';

const Extends = Abstract_Neighbor(Abstract_Sprite(Abstract_Road(Abstract_User(Unit))));
class Road extends Extends {
    constructor() {
        super();
        this.setType(UNIT_TYPES.ROAD.DEFAULT);
        this.selectable = false;
        this.walkable = true;

    }

    isNeighbor(unit) {
        return unit.isType(this.type);
    }

}

UNIT_TYPES.ROAD = {
    DEFAULT: 'road.default'
};
UNITS_DATA[UNIT_TYPES.ROAD.DEFAULT] = {
    type: UNIT_TYPES.ROAD.DEFAULT,
    title: 'Einfacher Weg (Straße)',
    description: 'Ein Fahrzeug bevorzugt einen vorbereiteten Weg.'
};
UNIT_CLASSES[UNIT_TYPES.ROAD.DEFAULT] = Road;
export default Road;
