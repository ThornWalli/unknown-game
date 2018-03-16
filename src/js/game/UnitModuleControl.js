'use strict';

import {
    TYPES as UNIT_TYPES
} from './utils/unit';

/**
 * Verwaltet die Bots.
 */
export default class UnitModuleControl {
    constructor(app) {
        this._app = app;

        this._units = this._app.map.units
            .on('add', onAddUnit, this)
            .on('remove', onRemoveUnit, this);
        this._units = this._app.map.units.createFilteredCollection(collectionFilter.bind(this));

    }

    /*
     * Properties
     */

    get units() {
        return this._units;
    }
}

function collectionFilter(unit) {
    if (setupUnit(unit, this._app)) {
        return unit;
    }
}



function setupUnit(unit, app) {
    if (isModuleUnit(unit)) {
        unit.setupModule(app);
        return true;
    } else {
        return false;
    }
}

function onAddUnit(unit) {
    setupUnit(unit, this._app);
}

function onRemoveUnit(unit) {
    if (isModuleUnit(unit)) {
        this._units.remove(unit, {
            passive: true
        });
    }
}

function isModuleUnit(unit) {
    return unit.isType(UNIT_TYPES.MODULE);
}
