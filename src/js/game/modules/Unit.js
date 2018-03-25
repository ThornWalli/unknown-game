'use strict';

import Module from '../base/Module';
import {
    UNITS as UNIT_TYPES
} from '../types';

export default class Unit extends Module {
    constructor(app, unit) {
        super(app, unit);
        this.unit.on('selected.change', (unit, selected) => {
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
}


function onSelectSecondary(selectedUnits, position) {
    if (selectedUnits.indexOf(this.unit) > -1) {
        this.onSelectSecondary(this.app.map.getUnitsByCell(position.x, position.y).filter(unit => isUnitNotRoad(unit))[0], selectedUnits, position);
    }
}

function isUnitNotRoad(unit) {
    if (!unit.isType(UNIT_TYPES.ROAD)) {
        return true;
    }
}
