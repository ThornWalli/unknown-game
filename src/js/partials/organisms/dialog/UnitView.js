'use strict';

import {
    TYPES as UNIT_TYPES
} from '../../../game/utils/unit';

import Dialog from '../Dialog';

import Template from '../../../base/Template';
import itemTmpl from './tmpl/depotItem.hbs';

export default Dialog.extend({

    itemTmpl: new Template(itemTmpl),

    pathLength: 0,

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {
            unit: {
                type: 'object',
                required: false
            },
            action: {
                type: 'object',
                required: false
            }
        }
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);

        this.model.once('change:tabContainer', (model, tabContainer) => {
            tabContainer.openByName('storage');
        });

        // Info
        this.elements.info = this.queryByHook('unitViewInfo');

        // Storage
        this.elements.storageItems = this.queryByHook('unitViewStorageItems');

        // Depot
        this.elements.depotUnits = this.queryByHook('unitViewDepotUnits');

    },

    onAppReady(app){
        app.unitSelect.on('select', unit => {
            if (this.model.unit) {
                unregister.bind(this)(this.model.unit);
            }
            register.bind(this)(unit);
        });
        if (app.unitSelect.selectedUnits.length > 0) {
            register.bind(this)(app.unitSelect.selectedUnits[0]);
        }
    }

});

function register(unit) {
    this.model.unit = unit;
    setupUnit.bind(this)(unit);
}

function unregister(unit) {
    unit.off(null, null, this);
    unit.module.off(null, null, this);
}


function setupUnit(unit) {

    // Info

    renderInfo.bind(this)(unit);

    // Storage

    if (unit.isType(UNIT_TYPES.STORAGE)) {
        renderStorage.bind(this)(unit);
        unit.module
            // .on('storage.value.add', onStorageTransfer, this)
            // .on('storage.value.remove', onStorageTransfer, this);
            .on('storage.value.transfer', onStorageTransfer, this);
        this.model.tabContainer.showTab('storage');
    } else {
        this.model.tabContainer.hideTab('storage');
    }

    // Depot

    if (unit.isType(UNIT_TYPES.BUILDING.DEPOT)) {
        renderDepot.bind(this)(unit);
        unit.module
            .on('storage.units.add', onAddRemoveDepotUnit, this)
            .on('storage.units.remove', onAddRemoveDepotUnit, this);
        this.model.tabContainer.showTab('depot');
    } else {
        this.model.tabContainer.hideTab('depot');
    }


}

// Info

function renderInfo(unit) {
    this.elements.info.innerHTML = `Type: ${unit.type}<br />ID: ${unit.id}`;
}

// Storage

function renderStorage(module) {
    let html = '';
    Object.keys(module.storageItems).forEach(key => {
        html += `${key}: ${module.storageItems[key]}<br />`;
    });
    this.elements.storageItems.innerHTML = html;
}

function onStorageTransfer(module) {
    renderStorage.bind(this)(module);
}

// Depot

function renderDepot(unit) {
    this.elements.depotUnits.innerHTML = '';
    unit.module.storageUnits.forEach(unit => {
        this.elements.depotUnits.appendChild(this.itemTmpl.toFragment({
            id: unit.id,
            title: unit.type
        }));
    });
}

function onAddRemoveDepotUnit(module) {
    renderDepot.bind(this)(module.unit);
}
