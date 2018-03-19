'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

/**
 * Abstract Class Moveable
 */
const Moveable = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.MOVEABLE);
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
UNIT_TYPES.MOVEABLE = 'moveable';
UNIT_CLASSES[UNIT_TYPES.MOVEABLE] = Moveable;

export default Moveable;
