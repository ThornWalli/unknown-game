'use strict';

import {
    UNIT_CLASSES,
    UNITS_DATA,
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
    }
}

UNIT_TYPES.BUILDING.DEPOT.VEHICLE = 'building.depot.vehicle';
UNITS_DATA[UNIT_TYPES.BUILDING.DEPOT.VEHICLE] = {
    type: UNIT_TYPES.BUILDING.DEPOT.VEHICLE,
    title: 'Fahrzeug Depot (Depot)',
    description: 'Hier können die Fahrzeuge parken.',
    energy: 0
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.DEPOT.VEHICLE] = Vehicle;
export default Vehicle;
