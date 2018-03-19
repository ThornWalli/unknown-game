'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../../types';

import Depot from '../Depot';
import Module from '../../abstract/Module';
import Sprite from '../../abstract/Sprite';

import DepotModule from '../../../../modules/unit/Depot';

class Vehicle extends Sprite(Module(Depot)) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.DEPOT.VEHICLE);
        this.setSprite(UNIT_TYPES.BUILDING.DEPOT.VEHICLE);

        this.setModule(DepotModule);

        this.selectable = true;
        this.walkable = false;

        this.portOffset.setValuesLocal(0, 1);
    }
}

UNIT_TYPES.BUILDING.DEPOT.VEHICLE = 'building.depot.vehicle';
UNIT_CLASSES[UNIT_TYPES.BUILDING.DEPOT.VEHICLE] = Vehicle;
export default Vehicle;
