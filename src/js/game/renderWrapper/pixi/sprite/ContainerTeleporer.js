'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';

class ContainerTeleporter extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER) {
        super(unit, spriteType);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER] = ContainerTeleporter;
export default ContainerTeleporter;
