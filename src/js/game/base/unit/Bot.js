'use strict';

import {
    TYPES,
    CLASSES
} from '../../utils/unit';

import Figure from './Figure';
import Module from './abstract/Module';

class Bot extends Module(Figure) {
    constructor() {
        super();
        this.setType(TYPES.BOT);
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
TYPES.BOT = 'bot';
CLASSES[TYPES.BOT] = Bot;
export default Bot;
