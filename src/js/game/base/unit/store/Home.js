'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

import {
    SPRITES
} from '../../../utils/sprites';

import Store from '../Store';
import Sprite from '../abstract/Sprite';

import HomeModule from '../../../modules/unit/Home';

class Home extends Sprite(Store) {
    constructor() {
        super();
        this.setType(TYPES.HOME);
        this.selectable = true;
        this.walkable = false;
        this.setModule(HomeModule);
        this.setSprite(SPRITES.BUILDING.STORAGE);
    }
}

TYPES.HOME = 'home';
CLASSES[TYPES.HOME] = Home;
export default Home;
