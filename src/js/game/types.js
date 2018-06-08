'use strict';

import {
    getFromXPath
} from './utils';

import ACTIONS from './types/actions';
import {
    default as UNITS,
    UNITS_DATA
} from './types/units';
import {
    default as ITEMS,
    ITEMS_DATA,
    ITEMS_DATA_MAP
} from './types/items';
import {
    default as DIRECTIONS,
    TRANSFER_DIRECTIONS
} from './types/directions';
import UNIT_CLASSES from './types/unitClasses';
import SPRITE_CLASSES from './types/spriteClasses';
import SPRITE_BLUEPRINTS from './types/spriteBlueprints';

global.UNIT_TYPES = UNITS;

function getTypes(type) {
    if (type) {
        return getFromXPath(type.replace(/\.default$/, '').toUpperCase().split('.'), UNITS);
    } else {
        return UNITS;
    }
}

function getItems(item) {
    if (item) {
        return getFromXPath(item.replace(/\.default$/, '').toUpperCase().split('.'), ITEMS);
    } else {
        return UNITS;
    }
}

export {
    ACTIONS,
    UNITS,
    UNITS_DATA,
    ITEMS,
    ITEMS_DATA,
    ITEMS_DATA_MAP,
    DIRECTIONS,
    TRANSFER_DIRECTIONS,
    UNIT_CLASSES,
    SPRITE_CLASSES,
    SPRITE_BLUEPRINTS,
    getTypes,
    getItems
};
