'use strict';

import App from '../App';

import {
    UNIT_CLASSES
} from '../types';

export default class MapBuilder extends App {

    constructor(containerEl, options) {
        super(containerEl, options);
        this.selectedUnitType = null;
    }

    onPointerDown(event) {
        App.prototype.onPointerDown.apply(this, arguments);

        if (this.display.isIntersectedPosition(event.matrixPosition)) {
            const x = event.matrixPosition.x,
                y = event.matrixPosition.y;
            let unit = this.map.getUnitByCell(x, y);

            if (unit) {
                this.map.units.remove(unit);
            } else {
                const unit = new(UNIT_CLASSES[this.selectedUnitType])();
                unit.position.setValuesLocal(x, y);
                this.map.units.add(unit, {
                    silence: false
                });
            }
            this.map.refresh();
        }
    }
}
