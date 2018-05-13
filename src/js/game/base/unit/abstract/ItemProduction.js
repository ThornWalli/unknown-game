'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const Production = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.ITEM_PRODUCTION);
    }
};
UNIT_TYPES.ITEM_PRODUCTION = 'item_production';
UNIT_CLASSES[UNIT_TYPES.ITEM_PRODUCTION] = Production;
export default Production;
