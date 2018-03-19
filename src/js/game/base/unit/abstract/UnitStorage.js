'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const UnitStorage = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.UNIT_STORAGE);
    }
};

UNIT_TYPES.UNIT_STORAGE = 'unit_storage';
UNIT_CLASSES[UNIT_TYPES.UNIT_STORAGE] = UnitStorage;
export default UnitStorage;
