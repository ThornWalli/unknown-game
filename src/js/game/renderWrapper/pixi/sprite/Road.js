'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

// import {
//     Sprite as PIXI_Sprite,
//     Texture
// } from 'pixi.js';
import Sprite from '../Sprite';
import Abstract_Area from './abstract/Area';

class Road extends Abstract_Area(Sprite) {
    constructor(unit, spriteType = UNIT_TYPES.ROAD.DEFAULT) {
        super(unit, spriteType);

    }

    onAdded() {}
}

SPRITE_CLASSES[UNIT_TYPES.ROAD.DEFAULT] = Road;
export default Road;

//
// function getSpriteType(spriteType, x = 1, y = 1) {
//     return `${spriteType}_${x}_${y}`;
// }
