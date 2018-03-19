'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const Spawn = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.SPAWN);
    }
};
UNIT_TYPES.SPAWN = 'spawn';
UNIT_CLASSES[UNIT_TYPES.SPAWN] = Spawn;
export default Spawn;
