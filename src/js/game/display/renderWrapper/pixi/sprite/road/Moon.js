'use strict';

import {
    SPRITES
} from '../../../../../utils/sprites';

import Area from '../Area';

export default class Road extends Area {
    constructor(unit, spriteType = SPRITES.ROAD.MOON) {
        super(unit, spriteType);

    }


}
