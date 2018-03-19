'use strict';

import {
    UNITS as UNIT_TYPES
} from './types';

/**
 * Verwaltet die Module.
 */
export default class UnitModuleControl {
    constructor(app) {
        this._app = app;

        this._units = this._app.map.units.createFilteredCollection(collectionFilter);
        this._units.on('add', onAddUnit, this);
        [].concat(this._units.items).forEach(item => setupUnit(item, app));
    }

    /*
     * Properties
     */

    get units() {
        return this._units;
    }
}

function collectionFilter(unit) {
    if (isModuleUnit(unit)) {
        return true;
    }
}

function setupUnit(unit, app) {
        unit.setupModule(app);
}

function onAddUnit(unit) {
    setupUnit(unit, this._app);
}

function isModuleUnit(unit) {
    return unit.isType(UNIT_TYPES.MODULE);
}
