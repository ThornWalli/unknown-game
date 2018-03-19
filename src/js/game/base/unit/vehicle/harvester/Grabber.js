'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../../types';

import Harvester from '../Harvester';

class Grubber extends Harvester {
    constructor() {
        super();
        this.setType(UNIT_TYPES.VEHICLE.HARVESTER.GRABBER);
        this.setSpriteType(UNIT_TYPES.VEHICLE.HARVESTER.GRABBER);
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 20;
    }
}

UNIT_TYPES.VEHICLE.HARVESTER.GRABBER = 'vehicle.harvester.grabber';
UNIT_CLASSES[UNIT_TYPES.VEHICLE.HARVESTER.GRABBER] = Grubber;
export default Grubber;
