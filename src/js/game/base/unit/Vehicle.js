'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Bot from './Bot';
import Sprite from './abstract/Sprite';

class Vehicle extends Sprite(Bot) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.VEHICLE.DEFAULT);
        this.selectable = true;
    }
}

UNIT_TYPES.VEHICLE = {
    DEFAULT: 'vehicle.default'
};
UNIT_CLASSES[UNIT_TYPES.VEHICLE.DEFAULT] = Vehicle;
export default Vehicle;
