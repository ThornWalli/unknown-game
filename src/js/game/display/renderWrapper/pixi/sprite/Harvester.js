'use strict';


import {
    SPRITES
} from '../../../../utils/sprites';

import Sprite from '../Sprite';

export default class Harvester extends Sprite {
    constructor(unit, name = SPRITES.VEHICLE.HARVESTER.GRUBBER) {
        super(unit, name);

    }
}
