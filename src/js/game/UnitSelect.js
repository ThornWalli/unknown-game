'use strict';

import Events from './base/Events';
import Position from './base/Position';

/**
 * Verwaltet die Unit-Auswahl.
 */
export default class UnitSelect extends Events {
    constructor(app) {
        super();
        this._app = app;
        this._selectedUnits = [];
    }

    // Functions

    selectUnit(unit) {
        unit.selected = true;
        this._selectedUnits.push(unit);
        this.trigger('select', unit);
    }

    clearSelectUnits() {
        if (this._selectedUnits.length) {
            while (this._selectedUnits.length) {
                const unit = this._selectedUnits.shift();
                unit.selected = false;
                this.trigger('unselect', unit);
            }
        }
    }

    // Properties

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
        const x = Math.floor((event.x + offset.x) / this.app.map.cellSize.width),
            y = Math.floor((event.y + offset.y) / this.app.map.cellSize.height);

        if (selectedUnits.length && event.secondaryClick) {

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

        } else if (this.selectedUnits.length && event.primaryClick) {

            // Clear selected Units
            this.clearSelectUnits();

        } else {

            // const x = Math.floor((event.x - offset.x) / this.app.map.cellSize.width) + this.visibleBounds.min.x,
            //     y = Math.floor((event.y - offset.y) / this.app.map.cellSize.height) + this.visibleBounds.min.y;
            const units = this.app.map.getUnitsByCell(x, y);
            if (units.length > 0) {
                // select
                for (var i = 0; i < units.length; i++) {
                    if (units[i].selectable) {
                        this.selectUnit(units[i]);
                        break;
                    }
                }
            }
        }

        this.app.map.refresh();
    }

}
