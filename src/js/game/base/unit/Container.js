'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Resource from './Resource';

class Container extends Resource {
    constructor() {
        super();
        this.setType(UNIT_TYPES.CONTAINER.DEFAULT);
        this.setSprite(UNIT_TYPES.CONTAINER.DEFAULT);
    }
}
UNIT_TYPES.CONTAINER.DEFAULT = 'container.default';
UNIT_CLASSES[UNIT_TYPES.CONTAINER.DEFAULT] = Container;
export default Container;
