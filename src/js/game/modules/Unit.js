'use strict';

import {
    GRID_CELL_TYPES,
    getPositionsAroundPositionCircle
} from '../utils/matrix';

import Module from '../base/Module';
import {
    UNITS as UNIT_TYPES
} from '../types';

export default class Unit extends Module {
    constructor(app, unit) {
        super(app, unit);
        this.unit.on('change.selected', (unit, selected) => {
            if (selected) {
                this.app.unitSelect.on('selectSecondary', onSelectSecondary, this);
            } else {
                this.app.unitSelect.off(null, null, this);
            }
        });
    }


    /*
     * Functions
     */

    /**
     * Tritt ein wenn Unit ausgewählt ist und eine sekundäre Interaktion (Rechts Klick) stattfindet.
     * @param  {Array<game.base.Unit>} selectedUnits
     * @param  {game.base.Position} position
     */
    onSelectSecondary(unit, selectedUnits, position) {
        console.log(unit, selectedUnits, position);
    }


    /*
     * Properties
     */


    /**
     * Ruft die Port Position der Unit ab.
     * @return {game.base.Position}
     */
    get portPosition() {
        if (this.unit.isType(UNIT_TYPES.NEIGHBOR) && this.unit.neighbors && this.unit.neighbors.length > 0) {
            const targetUnit = this.unit.neighbors.find((unit, i) => {
                const position = this.unit.neighborPositions[i];
                const isHV = position[0] !== 0 && position[1] === 0 || position[0] === 0 && position[1] !== 0;
                return unit.isType(UNIT_TYPES.ROAD.DEFAULT) && isHV;
            });
            if (targetUnit) {
                return targetUnit.position.clone();
            }
        }
        return getPositionsAroundPositionCircle(this.unit.position, 1).find(position => {
            if (this.app.map.isCellWalkable(position.x, position.y) !== GRID_CELL_TYPES.BLOCKED) {
                return true;
            }
        });
    }

    /**
     * Ruft die Port Offset der Unit ab.
     * @return {game.base.Position}
     */
    get portOffset() {
        return this._portOffset;
    }
}


function onSelectSecondary(selectedUnits, position) {
    if (selectedUnits.indexOf(this.unit) > -1) {
        this.onSelectSecondary(this.app.map.getUnitsByCell(position.x, position.y).filter(unit => unit.active && isUnitNotRoad(unit))[0], selectedUnits, position);
    }
}

function isUnitNotRoad(unit) {
    if (!unit.isType(UNIT_TYPES.ROAD)) {
        return true;
    }
}
