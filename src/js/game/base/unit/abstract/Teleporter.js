'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const Production = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.TELEPORTER);
    }
};
UNIT_TYPES.TELEPORTER = 'teleporter';
UNIT_CLASSES[UNIT_TYPES.TELEPORTER] = Production;
export default Production;
