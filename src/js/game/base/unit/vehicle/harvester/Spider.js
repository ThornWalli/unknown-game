'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../../types';

import Harvester from '../Harvester';

class Spider extends Harvester {
    constructor() {
        super();
        this.setType(UNIT_TYPES.VEHICLE.HARVESTER.SPIDER);
        this.setSpriteType(UNIT_TYPES.VEHICLE.HARVESTER.SPIDER);
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 40;
    }
}

UNIT_TYPES.VEHICLE.HARVESTER.SPIDER = 'vehicle.harvester.spierder';
UNIT_CLASSES[UNIT_TYPES.VEHICLE.HARVESTER.SPIDER] = Spider;
export default Spider;
