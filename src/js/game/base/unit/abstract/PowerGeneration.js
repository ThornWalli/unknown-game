'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const PowerStation = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.POWER_GENERATION);
    }
};

UNIT_TYPES.POWER_GENERATION = 'power_generation';
UNIT_CLASSES[UNIT_TYPES.POWER_GENERATION] = PowerStation;
export default PowerStation;
