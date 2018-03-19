'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Building from '../Building';

import Abstract_UnitStorage from '../abstract/UnitStorage';

class Depot extends Abstract_UnitStorage(Building) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT);
    }
}
UNIT_TYPES.BUILDING.DEPOT = {
    DEFAULT : 'building.depot.default'
};
UNIT_CLASSES[UNIT_TYPES.BUILDING.DEPOT.DEFAULT] = Depot;
export default Depot;
