'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class PowerStation extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.POWER_STATION.DEFAULT) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.POWER_STATION.DEFAULT] = PowerStation;
export default PowerStation;
