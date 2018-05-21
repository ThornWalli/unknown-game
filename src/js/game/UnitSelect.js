'use strict';

import Events from './base/Events';

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
    }

    /*
     * Functions
     */

    selectUnit(unit) {
        this._selectedUnits.push(unit);
        this.select(unit);
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

    /*
     * Properties
     */

    get app() {
        return this._app;
    }
    get selectedUnits() {
        return this._selectedUnits;
    }

    // Events

    onPointerDown(event) {

        const selectedUnits = this._selectedUnits,
            offset = this.app.display.getOffset();

        const position = offset.add(event).divideLocal(this.app.map.cellSize).floorLocal();

        if (selectedUnits.length && event.secondaryClick) {
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

            // const x = Math.floor((event.x - offset.x) / this.app.map.cellSize.width) + this.visibleBounds.min.x,
            //     y = Math.floor((event.y - offset.y) / this.app.map.cellSize.height) + this.visibleBounds.min.y;
            let units = this.app.map.getUnitsByCell(position.x, position.y);
            if (units.length > 0) {
                units.sort(function(a, b) {
                    a = getZIndexByUnit(a) || 0;
                    b = getZIndexByUnit(b) || 0;
                    return b - a;
                }).find(unit => {
                    if (this._forcedSelectable || unit.selectable) {
                        this.selectUnit(unit);
                        return true;
                    }
                });
                // select
                // for (var i = 0; i < units.length; i++) {
                //     if (units[i].selectable) {
                //         this.selectUnit(units[i]);
                //         break;
                //     }
                // }
            }
        }

        this.app.map.refresh();
    }

}
