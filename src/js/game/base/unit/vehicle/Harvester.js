'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Vehicle from '../Vehicle';

import Abstract_ItemStorage from '../abstract/ItemStorage';

import HarvesterModule from '../../../modules/unit/vehicle/transporter/Harvester';

class Harvester extends Abstract_ItemStorage(Vehicle) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.VEHICLE.HARVESTER.DEFAULT);
        this.setSpriteType(UNIT_TYPES.VEHICLE.HARVESTER.DEFAULT);
        this.setModule(HarvesterModule);
    }
    onModuleReady(module) {
        module.maxItemStorageItemValue = 20;
    }
}

UNIT_TYPES.VEHICLE.HARVESTER = {
    DEFAULT: 'vehicle.harvester.default'
};
UNIT_CLASSES[UNIT_TYPES.VEHICLE.HARVESTER.DEFAULT] = Harvester;
export default Harvester;
