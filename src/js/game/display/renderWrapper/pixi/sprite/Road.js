'use strict';

import {
    SPRITES
} from '../../../../../utils/sprites';

import {
    Sprite as PIXI_Sprite,
    Texture
} from 'pixi.js';
import Area from 'Area';

export default class Road extends Area {
    constructor(unit, spriteType = SPRITES.ROAD.MOON) {
        super(unit, spriteType);

    }


    onAdded() {}
}

function getSpriteType(spriteType, x = 1, y = 1) {
    return `${spriteType}_${x}_${y}`;
}
