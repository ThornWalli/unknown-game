'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

/**
 * Abstract Class Neighbor
 */
const Neighbor = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(TYPES.NEIGHBOR);
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

TYPES.NEIGHBOR = 'neighbor';
CLASSES[TYPES.NEIGHBOR] = Neighbor;

export default Neighbor;
