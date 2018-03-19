'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

/**
 * Abstract Class Neighbor
 */
const Neighbor = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.NEIGHBOR);
        this._neighbors = [];
    }

    get neighbors() {
        return this._neighbors;
    }

    set neighbors(neighbors) {
        this._neighbors = neighbors;
        this.trigger('change.neighbors', neighbors, this);
    }
};

UNIT_TYPES.NEIGHBOR = 'neighbor';
UNIT_CLASSES[UNIT_TYPES.NEIGHBOR] = Neighbor;

export default Neighbor;
