'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

/**
 * Abstract Class Moveable
 */
const Moveable = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(TYPES.MOVEABLE);
        this._moveData = null;
    }

    /*
     * Functions
     */

    move(moveData) {
        console.log('Unit move:', moveData);
        this.moveData = moveData;
        this.trigger('move', this.moveData);
    }

    /*
     * Properties
     */

    get moveData() {
        return this._moveData;
    }
    set moveData(moveData) {
        this._moveData = moveData;
    }
};
TYPES.MOVEABLE = 'moveable';
CLASSES[TYPES.MOVEABLE] = Moveable;

export default Moveable;
