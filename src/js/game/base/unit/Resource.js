'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Unit from '../Unit';
import Sprite from './abstract/Sprite';
import Module from './abstract/Module';
import ResourceModule from '../../modules/unit/Resource';

class Resource extends Sprite(Module(Unit)) {
    constructor() {
        super();
        this.setType(TYPES.RESOURCE);
        this.selectable = true;
        this.walkable = false;
        this.setModule(ResourceModule);
    }
}
TYPES.RESOURCE = 'resource';
CLASSES[TYPES.RESOURCE] = Resource;
export default Resource;
