'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

import {
    SPRITES
} from '../../../utils/sprites';

import Bot from '../Bot';
import Sprite from '../abstract/Sprite';
import HarvesterModule from '../../../modules/unit/vehicle/transporter/Harvester';

class Harvester extends Sprite(Bot) {
    constructor() {
        super();
        this.setType(TYPES.VEHICLE.HARVESTER);
        this.setSpriteType(SPRITES.VEHICLE.HARVESTER.GRUBBER);
        this.selectable = true;
        this.setModule(HarvesterModule);
    }
}

TYPES.VEHICLE.HARVESTER = 'harvester';
CLASSES[TYPES.VEHICLE.HARVESTER] = Harvester;
export default Harvester;
