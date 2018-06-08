'use strict';

import Events from './base/Events';

import {
    UNITS as UNIT_TYPES,
    UNIT_CLASSES
} from './types';

import {
    getZIndexByUnit
} from './utils/unit';

/**
 * Verwaltet die Unit-Auswahl.
 */
export default class UnitSelect extends Events {
    constructor(app, forcedSelectable = false) {
        super();
        this._forcedSelectable = forcedSelectable;
        this._app = app;
        this._selectedUnits = [];
        this._selectedUnitType = null;
    }

    /*
     * Functions
     */

    selectUnit(unit) {
        this._selectedUnits.push(unit);
        this.select(unit);

        // TODO Weg machen
        global.selectedUnit = unit;
    }

    removeSelectUnit(unit) {
        if (this._selectedUnits.indexOf(unit) > -1) {
            this._selectedUnits.splice(this._selectedUnits.indexOf(unit), 1);
            this.unselect(unit);
        }
    }

    clearSelectUnits() {
        if (this._selectedUnits.length) {
            while (this._selectedUnits.length) {
                this.unselect(this._selectedUnits.shift());
            }
        }
    }

    select(unit) {
        unit.selected = true;
        this.trigger('select', unit);
    }

    unselect(unit) {
        unit.selected = false;
        this.trigger('select', null);
        this.trigger('unselect', unit);
    }

    createUnit(position) {
        const unit = new(UNIT_CLASSES[this._selectedUnitType])();
        unit.user = this.app.user;
        unit.position.setLocal(position);
        this.app.map.units.add(unit, {
            silence: false
        });
    }

    /*
     * Properties
     */

    get app() {
        return this._app;
    }
    get selectedUnits() {
        return this._selectedUnits;
    }
    get selectedUnitType() {
        return this._selectedUnitType;
    }
    set selectedUnitType(value) {
        this._selectedUnitType = value;
    }

    // Events

    onAddUnit(position) {
        const units = this.app.map.getUnitsByCell(position.x, position.y);
        if (units.length > 0) {
            // if (this.app.map.isCellRoad()) {
            // console.log('units[0]', units[0]);
            // }
            if (units[0].isType(UNIT_TYPES.ROAD.DEFAULT)) {
                units[0].remove();
            }
        } else {
            this.createUnit(position);
        }
    }

    removeSelectedUnits(toggle) {
        this._selectedUnits.forEach(unit => unit.setToRemove(toggle));
    }

    onPointerDown(event) {

        const selectedUnits = this._selectedUnits,
            offset = this.app.display.getOffset();

        const position = offset.add(event).divideLocal(this.app.map.cellSize).floorLocal();

        if (selectedUnits.length < 1 && event.primaryClick && this._selectedUnitType) {
            this.onAddUnit(position);
        } else if (selectedUnits.length && event.secondaryClick) {
            this.trigger('selectSecondary', selectedUnits, position);
            // console.log('click on unit');

            // const unit = this.app.map.getUnitsByCell(x,y);
            // if (true) {
            //     selectedUnits[0]
            // }
            // Move Unit
            // selectedUnits.forEach(unit => {
            //
            //     const position = new Position(x, y);
            //
            //     // get moveData
            //     this.app.map.getMoveData(unit, position).then(moveData => {
            //
            //
            //         // set moveData for move unit
            //         if (unit.activeAction && unit.activeAction.type === 'move') {
            //             console.log('KKKK');
            //             unit.activeAction.stop();
            //         }
            //         this.app.unitActions.add(unit, 'move', moveData);
            //     });
            // });

        } else {

            if (this.selectedUnits.length && event.primaryClick) {
                // Clear selected Units
                this.clearSelectUnits();
            }

            this.getUnitByPosition(position).find(unit => {
                if (this._forcedSelectable || unit.selectable) {
                    this.selectUnit(unit);
                    return true;
                }
            });
            // let units = this.app.map.getUnitsByCell(position.x, position.y);
            // if (units.length > 0) {
            //     units.sort(function(a, b) {
            //         a = getZIndexByUnit(a) || 0;
            //         b = getZIndexByUnit(b) || 0;
            //         return b - a;
            //     }).find(unit => {
            //         if (this._forcedSelectable || unit.selectable) {
            //             this.selectUnit(unit);
            //             return true;
            //         }
            //     });
            // }
        }

        this.app.map.refresh();
    }


    getUnitByPosition(position) {
        let units = this.app.map.getUnitsByCell(position.x, position.y);
        if (units.length > 0) {
            return units.sort(function(a, b) {
                a = getZIndexByUnit(a) || 0;
                b = getZIndexByUnit(b) || 0;
                return b - a;
            });
        }
        return [];
    }

}
