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
        console.log('event', event);

        if (event.primaryClick) {
            // primary

            return App.prototype.onPointerDown.apply(this, arguments);
        } else {
            App.prototype.onPointerDown.apply(this, arguments);
            if (this.display.isIntersectedPosition(event.matrixPosition)) {
                const x = event.matrixPosition.x,
                    y = event.matrixPosition.y;
                let unit = this.map.getUnitByCell(x, y);
                // secondary
                if (unit) {
                    this.map.units.remove(unit);
                } else if (this.selectedUnitType) {
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
}
