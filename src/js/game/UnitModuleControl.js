'use strict';

import {
    UNITS as UNIT_TYPES
} from './types';

/**
 * Verwaltet die Module.
 */
export default class UnitModuleControl {
    constructor(app, silent) {
        this._app = app;
        this._silent = silent;

        this._units = this._app.map.units.createFilteredCollection(collectionFilter);
        this._units.on('add', onAddUnit, this);
        [].concat(this._units.items).forEach(item => this.setupUnit(item, app));
    }

    /*
     * Functions
     */

    setupUnit(unit, app) {
        unit.setupModule(app, this._silent);
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

function onAddUnit(unit) {
    this.setupUnit(unit, this._app);
}

function isModuleUnit(unit) {
    return unit.isType(UNIT_TYPES.MODULE);
}
