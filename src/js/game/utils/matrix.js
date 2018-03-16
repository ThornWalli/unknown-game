'use strict';

import Position from '../base/Position';

/**
 * Gibt die nächste freie Position an. (Radial)
 * @param  {Map} map
 * @param  {Position} position
 * @param  {Number} radius
 * @return {Position}
 */
function getPositionAroundPositionBasic(position, y) {
    if (y) {
        position = new Position(position, y);
    }
    const positions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0]
    ];
    for (var i = 0; i < positions.length; i++) {
        if (positions[i][0] === 0 &&  positions[i][1] === 0) {
        positions[i] = null;
    } else {
        positions[i] = position.addValues(positions[i][0], positions[i][1]);
    }

    }
    return positions;
}


export {
    getPositionAroundPositionBasic
};
