'use strict';

import Sprite from '../Sprite';

import {
    SPRITES
} from '../../../../utils/sprites';

export default class Home extends Sprite {
    constructor(unit, name = SPRITES.BUILDING.STORAGE) {
        super(unit, name);

    }
}
