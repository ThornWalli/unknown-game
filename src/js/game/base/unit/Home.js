'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';


import Storage from './Storage';

import HomeModule from '../../modules/unit/Home';
import Abstract_Sprite from './abstract/Sprite';

class Home extends Abstract_Sprite(Storage) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BUILDING.HOME);
        this.setSprite(UNIT_TYPES.BUILDING.HOME);
        this.selectable = true;
        this.walkable = false;
        this.setModule(HomeModule);
    }
}

UNIT_TYPES.BUILDING.HOME = 'building.home';
UNIT_CLASSES[UNIT_TYPES.BUILDING.HOME] = Home;
export default Home;
