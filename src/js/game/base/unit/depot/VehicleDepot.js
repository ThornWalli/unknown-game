'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

import {
    SPRITES
} from '../../../utils/sprites';

import Depot from '../Depot';
import Sprite from '../abstract/Sprite';

import DepotModule from '../../../modules/unit/Depot';

class VehicleDepot extends Sprite(Depot) {
    constructor() {
        super();
        this.setType(TYPES.BUILDING.VEHICLE_DEPOT);
        this.selectable = true;
        this.walkable = false;
        this.setModule(DepotModule);
        this.setSprite(SPRITES.BUILDING.VEHICLE_DEPOT);
    }
}

TYPES.BUILDING.VEHICLE_DEPOT = 'vehicle_depot';
CLASSES[TYPES.BUILDING.VEHICLE_DEPOT] = VehicleDepot;
export default VehicleDepot;
