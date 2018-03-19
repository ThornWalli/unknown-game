'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Figure from './Figure';
import Module from './abstract/Module';

class Bot extends Module(Figure) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.BOT);
        this.selectable = false;
//
//         setTimeout(() => {
//
// //             this.app.unitActions.add(unit, 'move', moveData);
// // this.move(this.position.subtractValues(10,0));
//
//         }, 3000);
    }
}
UNIT_TYPES.BOT = 'bot';
UNIT_CLASSES[UNIT_TYPES.BOT] = Bot;
export default Bot;
