'use strict';

import {
    UNITS as UNIT_TYPES
} from '../types';

export default class UnitOverview {
    constructor(app) {
        this._app = app;
    }

    getBots() {
        return this._app.botControl.units;
    }
    getUnits() {
        return this._app.map.units;
        // .filter(unit => {
        //     if (true) {
        //         return unit;
        //     }
        // });
    }
    getUnitsByType(type) {
        return this._app.map.units.filter(unit => {
            if (unit.isType(type)) {
                return unit;
            }
        });
    }

    getUnitTypes(types = UNIT_TYPES) {
        return Object.keys(types).reduce((result, type) => {
            if (typeof types[type] === 'object') {
                result = result.concat(this.getUnitTypes(types[type]));
            } else {
                result.push(types[type]);
            }
            return result;
        }, []);
    }

}
