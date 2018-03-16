'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Unit from '../Unit';
import Module from './abstract/Module';

class Depot extends Module(Unit) {
    constructor() {
        super();
        this.setType(TYPES.BUILDING.DEPOT);
        this.selectable = true;
        this.walkable = false;
    }
}
TYPES.BUILDING.DEPOT = 'depot';
CLASSES[TYPES.BUILDING.DEPOT] = Depot;
export default Depot;
