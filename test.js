'use strict';


class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(position) {
        return new Position(this.x + position.x,
            this.y + position.y);
    }
    addValues(x, y) {
        return new Position(this.x + x,
            this.y + y);
    }
    addLocal(position) {
        this.x += position.x;
        this.y += position.y;
        return this;
    }
    subtractValues(x, y) {
        return new Position(this.x - x,
            this.y - y);
    }
    subtract(position) {
        return new Position(this.x - position.x,
            this.y - position.y);
    }
    subtractLocal(position) {
        this.x -= position.x;
        this.y -= position.y;
        return this;
    }
}



const position = new Position(3, 3);

// function getPositionAroundPositionBasic(position, y) {
//     if (y) {
//         position = new Position(position, y);
//     }
//     const positions = [
//         [0, -1],
//         [0, 1],
//         [-1, 0],
//         [1, 0]
//     ];
//     for (var i = 0; i < positions.length; i++) {
//         if (positions[i][0] === 0 && positions[i][1] === 0) {
//             positions[i] = null;
//         } else {
//             positions[i] = position.addValues(positions[i][0], positions[i][1]);
//         }
//
//     }
//     return positions;
// }
//
// console.log(getPositionAroundPositionBasic(position));



/**
 * Ruft in einem Kreisumfang, eine Position um die angegebene Position ab.
 * Wenn `filled` gesetzt, wird der Kreis gefüllt, die angegebene Position wird ignoriert.
 * Mit dem Radius kann die Breite bestimmt werden.
 * @param  {game.base.Position}  position
 * @param  {Number} radius
 * @param  {Boolean} filled
 * @return {game.base.Position}
 */
function getPositionAroundPositionCircle(position, radius = 3, filled = false) {
    const positions = [];
    for (var angle = 0; angle < (Math.PI * 2); angle += (Math.PI / 10)) {
        positions.push(getPositionByAngleRadius(angle, radius).addLocal(position));
    }
    // radius over 1, ignore position
    if (filled && radius > 1) {
        return positions.concat(getPositionAroundPositionCircle(position, radius - 1, filled));
    } else {
        return positions;
    }
}


/**
 * Ruft in einem Kreisumfang eine zufällige Position um die angegebene Position ab.
 * @param  {game.base.Position} position
 * @param  {Number} radius
 * @param  {Number} angle
 * @param  {Function} random
 * @return {game.base.Position}
 */
function getRandomSpawnPosition(position, radius = 3, angle = Math.PI * 2, random = Math.random) {
    radius = (radius - 1) * random() + 1;
    angle *= random();
    return getPositionByAngleRadius(angle, radius).addLocal(position);
}

function getPositionByAngleRadius(angle, radius) {
    return new Position(Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius));
}

// function hasFreePositionAroundPosition(position, radius = 3) {
//     const positions = getPositionAroundPositionCircle(position);
//
//     return positions;
// }

const matrix = Array(7);
for (var i = 0; i < matrix.length; i++) {
    matrix[i] = Array(7).fill(' ');
}
const radius = 3;

getPositionAroundPositionCircle(position, radius, true).forEach(pos => {
    matrix[pos.x][pos.y] = 'X';

});

const p = getRandomSpawnPosition(position, radius);
matrix[p.x][p.y] = 'Z';

console.log(matrix);

// function radToPosition(rad) {
//     return [
//         Math.cos(rad),
//         Math.sin(rad)
//     ];
// }
//
// const matrix = Array(7);
// for (var i = 0; i < matrix.length; i++) {
//     matrix[i] = Array(7).fill(' ');
// }
//
// matrix[3][3] = 'X';
//
//
// let angle = Math.PI * 2,
//     radius =1;
//
//     const position = getRandomSpawnPosition(Math.round(Math.random() * radius), Math.random() * angle);
//     matrix[position.x][position.y] = 'X';
//
//
//
// function getRandomSpawnPosition(radius = 3, angle = Math.PI * 2) {
//     const positions = radToPosition(angle);
//     return new Position(3 - Math.round(positions[0] * radius),
//         3 - Math.round(positions[1] * radius));
// }
//
// console.log({
//     radius,
//     angle
// });
// console.log(matrix);
