'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class Transporter extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT) {
        super(unit, spriteType);

    }
}

SPRITE_CLASSES[UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT] = Transporter;
export default Transporter;
