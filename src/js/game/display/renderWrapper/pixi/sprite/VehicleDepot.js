'use strict';


import {
    SPRITES
} from '../../../../utils/sprites';

import Sprite from '../Sprite';

export default class VehicleDepot extends Sprite {
    constructor(unit, name = SPRITES.BUILDING.VEHICLE_DEPOT) {
        super(unit, name);

    }
}
