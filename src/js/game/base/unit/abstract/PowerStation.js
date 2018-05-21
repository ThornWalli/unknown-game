'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const PowerStation = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.POWER_STATION);
    }
};

UNIT_TYPES.POWER_STATION = 'power_station';
UNIT_CLASSES[UNIT_TYPES.POWER_STATION] = PowerStation;
export default PowerStation;
