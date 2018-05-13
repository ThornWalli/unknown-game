'use strict';

import {
    getFromXPath
} from './utils';

import ACTIONS from './types/actions';
import UNITS from './types/units';
import ITEMS from './types/items';
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
    ITEMS,
    DIRECTIONS,
    TRANSFER_DIRECTIONS,
    UNIT_CLASSES,
    SPRITE_CLASSES,
    SPRITE_BLUEPRINTS,
    getTypes,
    getItems
};
