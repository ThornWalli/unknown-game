'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

const ItemStorage = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.ITEM_STORAGE);
    }
};
UNIT_TYPES.ITEM_STORAGE = 'item_storage';
UNIT_CLASSES[UNIT_TYPES.ITEM_STORAGE] = ItemStorage;
export default ItemStorage;
