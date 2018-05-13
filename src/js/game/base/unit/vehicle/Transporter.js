'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

import Vehicle from '../Vehicle';

import Abstract_ItemStorage from '../abstract/ItemStorage';

import TransporterModule from '../../../modules/unit/vehicle/Transporter';

class Transporter extends Abstract_ItemStorage(Vehicle) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT);
        this.setModule(TransporterModule);
    }
}

UNIT_TYPES.VEHICLE.TRANSPORTER = {
    DEFAULT: 'vehicle.transporter.default'
};
UNIT_CLASSES[UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT] = Transporter;
export default Transporter;
