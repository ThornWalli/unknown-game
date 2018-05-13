'use strict';

import {
    UNITS as UNIT_TYPES
} from '../types';

/*
 * Functions
 */

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
 * Sucht nach einer nächstgelegenden Unit nach Typ.
 * @param  {Array<game.base.Unit>} units
 * @param  {game.base.Position} position
 * @param  {game.types.units} unitType
 * @return {Array<game.base.Unit>}
 */
function getNearUnitsByUnitType(units, position, unitType) {
    const distances = getSortedUnitByDistance(position, units.filter(unit => {
        if (unit.isType(unitType)) {
            return unit;
        }
    }));
    return distances;
}

/**
 * Sucht nach einer nächstgelegenden Unit das Items beinhaltet.
 * @param  {Array<game.base.Unit>} units
 * @param  {game.base.Position} position
 * @param  {game.types.items} itemType
 * @return {Array<game.base.Unit>}
 */
function getNearUnitsByItemType(units, position, itemType) {
    const distances = getSortedUnitByDistance(position, units.filter(unit => {
        if (unit.isType(UNIT_TYPES.ITEM_STORAGE) && unit.isType(UNIT_TYPES.ITEM_PRODUCTION) && unit.module.hasItem(itemType)) {
            return unit;
        }
    }));
    return distances;
}

export {
    getDistance,
    getSortedUnitByDistance,
    getNearUnitsByUnitType,
    getNearUnitsByItemType
};
