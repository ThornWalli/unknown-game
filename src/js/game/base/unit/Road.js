'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Unit from '../Unit';
import Sprite from './abstract/Sprite';
import Neighbor from './abstract/Neighbor';

class Road extends Neighbor(Sprite(Unit)) {
    constructor() {
        super();
        this.setType(TYPES.ROAD);
        this.selectable = false;
        this.walkable = true;

    }
}
TYPES.ROAD = 'road';
CLASSES[TYPES.ROAD] = Road;
export default Road;
