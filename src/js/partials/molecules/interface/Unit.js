'use strict';

import {
    UNITS as UNIT_TYPES
} from '../../../game/types';

import Interface from '../Interface';

export default Interface.extend({

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {}
    }),

    events: Object.assign({}, Interface.prototype.events, {}),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);

        this.model.once('change:tabContainer', (model, tabContainer) => {
            tabContainer.openByName('storage');
        });
    },

    onAppReady(app) {
        Interface.prototype.onAppReady.apply(this, arguments);
        if (app.unitSelect && app.unitSelect.selectedUnits.length > 0) {
            register.bind(this)(app.unitSelect.selectedUnits[0]);
        }
    },

    onSelectUnit(unit) {
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (this.model.unit) {
            unregister.bind(this)(this.model.unit);
        }
        if (unit) {
            register.bind(this)(unit);
        }
        this.model.visible = !!unit;
    }

});



function register(unit) {
    this.model.unit = unit;
    setupUnit.bind(this)(unit);
    this.model.tabContainer.openByName('info');
}

function unregister() {
    this.model.unit = null;

}

// function elementVisibility(el, visible = false) {
//     el.style.display = visible ? null : 'none';
// }

function setupUnit(unit) {

    // Info
    setupInfo.bind(this)(unit, !!unit);

    // Vehicle
    setupVehicle.bind(this)(unit.module, unit.isType(UNIT_TYPES.VEHICLE.DEFAULT));

    // Storage
    setupStorage.bind(this)(unit.module, unit.isType(UNIT_TYPES.ITEM_STORAGE));

    // Depot
    setupDepot.bind(this)(unit.module, unit.isType(UNIT_TYPES.UNIT_STORAGE));

    // Teleporter
    setupTeleporter.bind(this)(unit.module, unit.isType(UNIT_TYPES.TELEPORTER));

}

/*
 * Info
 */

function setupInfo(unit, active) {
    if (active) {
        this.model.tabContainer.showTab('info');
    } else {
        this.model.tabContainer.hideTab('info');
    }
}

/*
 * Vehicle
 */

function setupVehicle(module, active) {
    if (active) {
        this.model.tabContainer.showTab('vehicle');
    } else {
        this.model.tabContainer.hideTab('vehicle');
    }
}

/*
 * Storage
 */

function setupStorage(module, active) {
    if (active) {
        this.model.tabContainer.showTab('storage');
    } else {
        this.model.tabContainer.hideTab('storage');
    }
}

/*
 * Depot
 */

function setupDepot(module, active) {
    if (active) {
        this.model.tabContainer.showTab('depot');
    } else {
        this.model.tabContainer.hideTab('depot');
    }
}

/*
 * Teleporter
 */

function setupTeleporter(module, active) {
    if (active) {
        this.model.tabContainer.showTab('teleporter');
    } else {
        this.model.tabContainer.hideTab('teleporter');
    }
}
