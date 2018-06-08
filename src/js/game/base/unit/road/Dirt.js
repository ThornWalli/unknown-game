'use strict';

import {
    UNIT_CLASSES,
    UNITS_DATA,
    UNITS as UNIT_TYPES
} from '../../../types';

import Road from '../Road';

class Dirt extends Road {
    constructor() {
        super();
        this.setType(UNIT_TYPES.ROAD.DIRT);

    }
}

UNIT_TYPES.ROAD.DIRT = 'road.dirt';
UNITS_DATA[UNIT_TYPES.ROAD.DIRT] = {
    type: UNIT_TYPES.ROAD.DIRT,
    title: 'Shotterstraße (Straße)',
    description: 'Ein Fahrzeug bevorzugt einen vorbereitete Straße.'
};
UNIT_CLASSES[UNIT_TYPES.ROAD.DIRT] = Dirt;
export default Dirt;
