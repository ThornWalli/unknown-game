'use strict';

const TYPES = {
    BUILDING: {},
    VEHICLE: []
};
const CLASSES = {};

const DIRECTIONS = {
    DEFAULT: 'default',
    LEFT: 'left',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom'
};

export {
    DIRECTIONS,
    TYPES,
    CLASSES
};


/*
 * Functions
 */

// /**
//  * Ruft die Distanz zwischen zwei Units ab.
//  * @param  {game.base.Unit} sourceUnit
//  * @param  {game.base.Unit} destUnit
//  * @return {game.base.Position}
//  */
// function getDistance(sourceUnit, destUnit) {
//     return sourceUnit.position.distance(destUnit.position);
// }
//
// /**
//  * Gibt eine Liste an Units zurück.
//  * Sortiert nach Distanz. (Absteigend)
//  * @param  {game.base.Unit} unit             Start Unit
//  * @param  {Array<game.base.Unit>} units     Ziel Units
//  * @return {Array<game.base.Unit>}
//  */
// function getSortedUnitByDistance(unit, units, desc = false) {
//     let value = 1;
//     if (desc) {
//         value = -value;
//     }
//     return units.map(resourceUnit => {
//         return {
//             unit: resourceUnit,
//             distance: getDistance(unit, resourceUnit)
//         };
//     }).sort((a, b) => {
//         if (a.distance > b.distance) {
//             return value;
//         } else if (a.distance < b.distance) {
//             return -value;
//         }
//         return 0;
//     });
//
// }

/**
* Ruft die Distanz zwischen zwei Units ab.
* @param  {game.base.Unit} sourceUnit
* @param  {game.base.Unit} destUnit
* @return {game.base.Position}
*/
function getDistance(srcPosition, destPosition) {
   return srcPosition.distance(destPosition);
}

/**
* Gibt eine Liste an Units zurück.
* Sortiert nach Distanz. (Absteigend)
* @param  {game.base.Unit} unit             Start Unit
* @param  {Array<game.base.Unit>} units     Ziel Units
* @return {Array<game.base.Unit>}
*/
function getSortedUnitByDistance(position, units, desc = false) {
   let value = 1;
   if (desc) {
       value = -value;
   }
   return units.map(resourceUnit => {
       return {
           unit: resourceUnit,
           distance: getDistance(position, resourceUnit.position)
       };
   }).sort((a, b) => {
       if (a.distance > b.distance) {
           return value;
       } else if (a.distance < b.distance) {
           return -value;
       }
       return 0;
   });

}

/**
 * Such nach dem nächsten Rohstoff vorkmmen.
 * @param  {game.base.Unit} unit
 * @return {Array<game.base.Unit>}
 */

/**
 * Sucht nach einer nächstgelegenden Unit nach Typ.
 * @param  {Array<game.base.Unit>} units
 * @param  {game.base.Position} position
 * @param  {[game.utils.unit.TYPES]} type
 * @return {Array<game.base.Unit>}
 */
function getNearUnitsByType(units, position, type) {
    const distances = getSortedUnitByDistance(position, units.filter(unit => {
        if (unit.isType(type)) {
            return unit;
        }
    }));
    return distances;
}

export {
    getDistance,
    getSortedUnitByDistance,
    getNearUnitsByType
};
