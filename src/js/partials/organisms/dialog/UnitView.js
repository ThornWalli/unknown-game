'use strict';

import {
    UNITS as UNIT_TYPES
} from '../../../game/types';

import Dialog from '../Dialog';

import Template from '../../../base/Template';
import itemTmpl from './tmpl/depotItem.hbs';
import dropdownOptionTmpl from '../../../tmpl/dropdownOption.hbs';

export default Dialog.extend({

    itemTmpl: new Template(itemTmpl),
    dropdownOptionTmpl: new Template(dropdownOptionTmpl),

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

    bindings: {
        'model.unit' : {
            type: 'booleanClass',
            name: 'js--visible'
        }
    },

    events: Object.assign(Dialog.prototype.events, {

        'click [data-hook="unitViewDepotUnits"] a': onClickDepotUnitsStart,

        'click [data-hook="unitViewVehicleMoveToDepotButton"]': onClickVehicleMoveToDepot,
        'click [data-hook="unitViewVehicleMoveToStorageButton"]': onClickVehicleMoveToStorage,

        'change [data-hook="unitViewVehicleDepotDropdown"]': onChangeVehicleDepot,
        'change [data-hook="unitViewVehicleStorageDropdown"]': onChangeVehicleStorage,
        'change [data-hook="unitViewHarvesterPreferredResourceDropdown"]': onChangeVehicleResource



    }),


    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);

        this.model.once('change:tabContainer', (model, tabContainer) => {
            tabContainer.openByName('storage');
        });

        // Info
        this.elements.info = this.queryByHook('unitViewInfo');

        // Vehicle
        this.elements.vehicleDepot = this.queryByHook('unitViewVehicleDepotDropdown');
        this.elements.vehicleStorage = this.queryByHook('unitViewVehicleStorageDropdown');

        // Harvester
        //
        this.elements.harvesterPreferredResourceWrapper = this.queryByHook('unitViewHarvesterPreferredResource');
        this.elements.harvesterPreferredResource = this.queryByHook('unitViewHarvesterPreferredResourceDropdown');

        // Storage
        this.elements.itemStorageItems = this.queryByHook('unitViewStorageItems');
        this.elements.depotUnits = this.queryByHook('unitViewDepotUnits');

    },

    onAppReady(app) {
        app.unitSelect.on('select', unit => {
            if (this.model.unit) {
                unregister.bind(this)(this.model.unit);
            }
            if (unit) {
                register.bind(this)(unit);
            }
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
    if (this.vehicleUnitStorages) {
        this.vehicleUnitStorages.destroy();
    }
    if (this.vehicleItemStorages) {
        this.vehicleItemStorages.destroy();
    }

    unit.off(null, null, this);
    unit.module.off(null, null, this);
    this.model.unit = null;

}

function elementVisibility(el, visible = false) {
    el.style.display = visible ? null : 'none';
}

function setupUnit(unit) {

    // Info
    setupInfo.bind(this)(unit, !!unit);

    // Vehicle
    setupVehicle.bind(this)(unit.module, unit.isType(UNIT_TYPES.VEHICLE.DEFAULT));

    // Harvester
    setupHarvester.bind(this)(unit.module, unit.isType(UNIT_TYPES.VEHICLE.HARVESTER.DEFAULT));

    // Storage
    setupStorage.bind(this)(unit.module, unit.isType(UNIT_TYPES.ITEM_STORAGE));

    // Depot
    setupDepot.bind(this)(unit.module, unit.isType(UNIT_TYPES.UNIT_STORAGE));

}


// Info

function setupInfo(unit, active) {
    if (active) {
        renderInfo.bind(this)(unit);
        this.model.tabContainer.showTab('info');
    } else {
        this.model.tabContainer.hideTab('info');
    }
}

function renderInfo(unit) {
    this.elements.info.innerHTML = [
        `Type: ${unit.type}`,
        `ID: ${unit.id}`,
        `Position: ${unit.position.toString()}`
    ].join('<br />');
}

function setupHarvester(module, active) {
    elementVisibility(this.elements.harvesterPreferredResourceWrapper, active);

    renderItems.bind(this)(Object.values(UNIT_TYPES.RESOURCE).map(resource => {
        return {
            id: resource,
            title: resource
        };
    }), this.elements.harvesterPreferredResource, module.harvesterPreferredResource);
}

// Vehicle

function setupVehicle(module, active) {
    if (active) {
        renderVehicle.bind(this)(module);
        this.model.tabContainer.showTab('vehicle');
    } else {
        this.model.tabContainer.hideTab('vehicle');
    }
}

function renderVehicle(module) {

    this.vehicleUnitStorages = module.app.map.units.createFilteredCollection(unit => {
        if (unit.isType(UNIT_TYPES.UNIT_STORAGE)) {
            return true;
        }
    });
    this.vehicleItemStorages = module.app.map.units.createFilteredCollection(unit => {
        if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT)) {
            return true;
        }
    });

    // UnitStorage

    this.vehicleUnitStorages.on('add', () => {
        renderItems.bind(this)(prepareStorage(this.vehicleUnitStorages), this.elements.vehicleDepot);
    }, this).on('remove', () => {
        renderItems.bind(this)(prepareStorage(this.vehicleUnitStorages), this.elements.vehicleDepot);
    }, this);
    renderItems.bind(this)(prepareStorage(this.vehicleUnitStorages), this.elements.vehicleDepot);

    // ItemStorage

    this.vehicleItemStorages.on('add', () => {
        renderItems.bind(this)(prepareStorage(this.vehicleUnitStorages), this.elements.vehicleStorage);
    }, this).on('remove', () => {
        renderItems.bind(this)(prepareStorage(this.vehicleUnitStorages), this.elements.vehicleStorage);
    }, this);
    renderItems.bind(this)(prepareStorage(this.vehicleUnitStorages), this.elements.vehicleStorage);

}

function prepareStorage(storages) {
    return storages.map(storage => {
        return {
            title: `${storage.type} (${storage.id})`,
            value: storage.id
        };
    });
}

function addDropdownItem(el, title, value) {
    el.appendChild(this.dropdownOptionTmpl.toFragment({
        value,
        title
    }));
}

// Storage

function setupStorage(module, active) {
    if (active) {
        module
            // .on('storage.value.add', onStorageTransfer, this)
            // .on('storage.value.remove', onStorageTransfer, this);
            .on('storage.value.transfer', () => {
                renderStorage.bind(this)(module);
            }, this);
        renderStorage.bind(this)(module);
        this.model.tabContainer.showTab('storage');
    } else {
        this.model.tabContainer.hideTab('storage');
    }
}

function renderStorage(module) {
    let html = '';
    Object.keys(module.itemStorageItems).forEach(key => {
        html += `${key}: ${module.itemStorageItems[key]}<br />`;
    });
    this.elements.itemStorageItems.innerHTML = html;
}

// Depot
function setupDepot(module, active) {
    if (active) {
        module
            .on('storage.units.add', () => {
                renderDepot.bind(this)(module);
            }, this)
            .on('storage.units.remove', () => {
                renderDepot.bind(this)(module);
            }, this);
        renderDepot.bind(this)(module);
        this.model.tabContainer.showTab('depot');
    } else {
        this.model.tabContainer.hideTab('depot');
    }
}

function renderDepot(module) {
    this.elements.depotUnits.innerHTML = '';
    module.unitStorageUnits.forEach(unit => {
        this.elements.depotUnits.appendChild(this.itemTmpl.toFragment({
            id: unit.id,
            title: unit.type
        }));
    });
}

function renderItems(items, el, value) {
    el.innerHTML = null;
    addDropdownItem.bind(this)(el, el.dataset.defaultTitle, el.dataset.defaultValue);
    items.forEach(item => addDropdownItem.bind(this)(el, item.title, item.id));
    if (value) {
        el.value = value;
    }
}


// Events

// Depot

function onClickDepotUnitsStart(e) {

    const unit = this.model.unit.module.app.map.getUnitById(e.target.dataset.id);
    console.log(unit);
    this.model.unit.module.removeUnitStorageUnit(unit);
    unit.module.start();
}

// Vehicle

function onClickVehicleMoveToDepot() {

}

function onClickVehicleMoveToStorage() {

}

function onChangeVehicleDepot(e) {
    console.log('onChangeVehicleDepot', e.target.value);
}

function onChangeVehicleStorage(e) {
    console.log('onChangeVehicleStorage', e.target.value);
}

function onChangeVehicleResource(e) {
    console.log('onChangeVehicleResource', e.target.value);
}
