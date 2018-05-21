'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const Consumption = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.CONSUMPTION);
    }
};

UNIT_TYPES.CONSUMPTION = 'consumption';
UNIT_CLASSES[UNIT_TYPES.CONSUMPTION] = Consumption;
export default Consumption;
