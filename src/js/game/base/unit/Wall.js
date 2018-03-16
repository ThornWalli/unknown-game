'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Unit from '../Unit';
import Sprite from './abstract/Sprite';

class Wall extends Sprite(Unit) {
    constructor() {
        super();
        this.setType(TYPES.WALL);
        this.selectable = true;
        this.walkable = false;

    }
}
TYPES.WALL = 'wall';
CLASSES[TYPES.WALL] = Wall;
export default Wall;
