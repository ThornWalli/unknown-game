'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class Harvester extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.VEHICLE.HARVESTER.GRABBER) {
        super(unit, spriteType);

    }
}

SPRITE_CLASSES[UNIT_TYPES.VEHICLE.HARVESTER.GRABBER] = Harvester;
export default Harvester;
