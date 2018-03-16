'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Unit from '../Unit';
import Action from './abstract/Action';
import Moveable from './abstract/Moveable';

import Sprite from './abstract/Sprite';

class Figure extends Moveable(Sprite(Action(Unit))) {
    constructor() {
        super();
        this.setType(TYPES.FIGURE);
        this.selectable = true;
        this.walkable = false;
    }
}
TYPES.FIGURE = 'figure';
CLASSES[TYPES.FIGURE] = Figure;
export default Figure;
