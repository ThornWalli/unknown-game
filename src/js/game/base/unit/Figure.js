'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Unit from '../Unit';
import Action from './abstract/Action';
import Moveable from './abstract/Moveable';

import Sprite from './abstract/Sprite';

class Figure extends Moveable(Sprite(Action(Unit))) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.FIGURE);
        this.selectable = true;
        this.walkable = false;
    }
}
UNIT_TYPES.FIGURE = 'figure';
UNIT_CLASSES[UNIT_TYPES.FIGURE] = Figure;
export default Figure;
