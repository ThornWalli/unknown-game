'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Unit from '../Unit';
import Abstract_Sprite from './abstract/Sprite';

class Wall extends Abstract_Sprite(Unit) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.WALL);
        this.selectable = true;
        this.walkable = false;

    }
}
UNIT_TYPES.WALL = 'wall';
UNIT_CLASSES[UNIT_TYPES.WALL] = Wall;
export default Wall;
