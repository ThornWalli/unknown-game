'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class VehicleDepot extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.DEPOT.VEHICLE) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.DEPOT.VEHICLE] = VehicleDepot;
export default VehicleDepot;
