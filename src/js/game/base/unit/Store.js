'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Unit from '../Unit';
import Module from './abstract/Module';

class Store extends Module(Unit) {
    constructor() {
        super();
        this.setType(TYPES.STORE);
        this.selectable = true;
        this.walkable = false;
    }
}
TYPES.STORE = 'store';
CLASSES[TYPES.STORE] = Store;
export default Store;
