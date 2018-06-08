'use strict';

import Position from '../base/Position';

/**
 * Ruft in einem Kreisumfang, eine Position um die angegebene Position ab.
 * Wenn `filled` gesetzt, wird der Kreis gefüllt, die angegebene Position wird ignoriert.
 * Mit dem Radius kann die Breite bestimmt werden.
 * @param  {game.base.Position}  position
 * @param  {Number} radius
 * @param  {Boolean} filled
 * @return {game.base.Position}
 */
function getPositionsAroundPositionCircle(position, radius = 3, filled = false) {
    let positions = [];
    for (var angle = 0; angle < (Math.PI * 2); angle += (Math.PI / 10)) {
        positions.push(getPositionByAngleRadius(angle, radius).addLocal(position));
    }
    // radius over 1, ignore position
    if (filled && radius > 1) {
        positions = positions.concat(getPositionsAroundPositionCircle(position, radius - 1, filled));
    }

    const filter = [];
    return positions.filter(position => {
        if (filter.indexOf(`${position.x}_${position.y}`) === -1) {
            filter.push(`${position.x}_${position.y}`);
            return position;
        }
    });
}


/**
 * Ruft in einem Kreisumfang eine zufällige Position um die angegebene Position ab.
 * @param  {game.base.Position} position
 * @param  {Number} radius
 * @param  {Number} angle
 * @param  {Function} random
 * @return {game.base.Position}
 */
function getRandomPositionCircle(position, radius = 3, angle = Math.PI * 2, random = Math.random) {
    radius = (radius - 1) * random() + 1;
    angle *= random();
    return getPositionByAngleRadius(angle, radius).addLocal(position);
}

function getPositionByAngleRadius(angle, radius) {
    return new Position(Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius));
}



function hasFreePositionAroundPosition() {

}


const GRID_CELL_TYPES = {
    DEFAULT: 0,
    BLOCKED: 1,
    ROAD: 2
};

export {
    GRID_CELL_TYPES,
    getPositionsAroundPositionCircle,
    getRandomPositionCircle,
    hasFreePositionAroundPosition
};
