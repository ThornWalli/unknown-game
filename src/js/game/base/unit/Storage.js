'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Unit from '../Unit';
import Module from './abstract/Module';

class Storage extends Module(Unit) {
    constructor() {
        super();
        this.setType(TYPES.STORAGE);
        this.selectable = true;
        this.walkable = false;
    }
}
TYPES.STORAGE = 'storage';
CLASSES[TYPES.STORAGE] = Storage;
export default Storage;
