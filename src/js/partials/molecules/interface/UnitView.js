'use strict';

import {
    UNITS as UNIT_TYPES
} from '../../../game/types';

import Interface from '../Interface';

import Template from '../../../base/Template';
import itemTmpl from './tmpl/depotItem.hbs';
import dropdownOptionTmpl from '../../../tmpl/dropdownOption.hbs';


export default Interface.extend({

    itemTmpl: new Template(itemTmpl),
    dropdownOptionTmpl: new Template(dropdownOptionTmpl),

    pathLength: 0,

    modelConstructor: Interface.prototype.modelConstructor.extend({
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
        'model.unit': {
            type: 'booleanClass',
            name: 'js--visible'
        }
    },

    events: Object.assign(Interface.prototype.events, {

        'click [data-hook="unitViewDepotUnits"] a': onClickDepotUnitsStart,

        'change [data-hook="unitViewVehicleDepotDropdown"]': onChangeVehicleDepot,
        'click [data-hook="unitViewVehicleMoveToDepotButton"]': onClickVehicleMoveToDepot,

        'change [data-hook="unitViewVTransporterStorageDropdown"]': onChangeTransporterStorage,
        'click [data-hook="unitViewTransporterMoveToStorageButton"]': onClickTransporterMoveToStorage,

        'change [data-hook="unitViewHarvesterPreferredResourceDropdown"]': onChangeVehicleResource,
        'click [data-hook="unitViewHarvesterMoveToResourceButton"]': onClickHarvesterMoveToResource




    }),


    initialize() {
        Interface.prototype.initialize.apply(this, arguments);

        this.model.once('change:tabContainer', (model, tabContainer) => {
            tabContainer.openByName('storage');
        });

        // Info
        this.elements.info = this.queryByHook('unitViewInfo');

        // Vehicle
        this.elements.vehicleDepot = this.queryByHook('unitViewVehicleDepotDropdown');
        this.elements.transporterStorage = this.queryByHook('unitViewTransporterStorageDropdown');

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
    this.model.tabContainer.openByName('info');
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
    if (active) {
        module.on('harvesterPreferredResourceType.change', (unit, value) => this.elements.harvesterPreferredResource.value = value, this);
        renderItems.bind(this)(Object.values(UNIT_TYPES.RESOURCE).map(resource => {
            return {
                id: resource,
                title: resource
            };
        }), this.elements.harvesterPreferredResource, module.harvesterPreferredResourceType);
    }
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
    renderItems.bind(this)(prepareStorage(this.vehicleUnitStorages), this.elements.vehicleDepot, getUnitId(module.vehiclePreferredDepotUnit));
    module.on('vehiclePreferredDepotUnit.change', (unit, value) => this.elements.vehicleDepot.value = getUnitId(value), this);

    // ItemStorage

    this.vehicleItemStorages.on('add', () => {
        renderItems.bind(this)(prepareStorage(this.vehicleItemStorages), this.elements.transporterStorage);
    }, this).on('remove', () => {
        renderItems.bind(this)(prepareStorage(this.vehicleItemStorages), this.elements.transporterStorage);
    }, this);
    renderItems.bind(this)(prepareStorage(this.vehicleItemStorages), this.elements.transporterStorage, getUnitId(module.transporterPreferredStorageUnit));
    module.on('transporterPreferredStorageUnit.change', (unit, value) => this.elements.transporterStorage.value = getUnitId(value), this);
}

function prepareStorage(storages) {
    return storages.map(storage => {
        return {
            title: `${storage.type} (${storage.id})`,
            id: storage.id
        };
    });
}

function addDropdownItem(el, title, value) {
    el.appendChild(this.dropdownOptionTmpl.toFragment({
        value,
        title
    }));
}


function getUnitId(unit) {
    if (unit) {
        return unit.id;
    }
    return null;
}

// Storage

function setupStorage(module, active) {
    if (active) {
        module
            // .on('storage.value.add', onStorageTransfer, this)
            // .on('storage.value.remove', onStorageTransfer, this);
            .on('storage.value.transfer', () => {
                console.log('???');
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
        console.log('unit',unit);
        this.elements.depotUnits.appendChild(this.itemTmpl.toFragment({
            id: unit.id,
            title: unit.type
        }));
    });
}

function renderItems(items, el, value) {
    el.innerHTML = null;
    console.log('???',el.dataset.defaultTitle || ' ', el.dataset.defaultValue|| ' ');
    addDropdownItem.bind(this)(el, el.dataset.defaultTitle || ' ', el.dataset.defaultValue);
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
    if (this.model.unit.module.vehiclePreferredDepotUnit) {
        this.model.unit.module.moveToDepot(this.model.unit.module.vehiclePreferredDepotUnit);
    }
}

function onClickTransporterMoveToStorage() {
    if (this.model.unit.module.transporterPreferredStorageUnit) {
        this.model.unit.module.moveToStroage(this.model.unit.module.transporterPreferredStorageUnit);
    }
}

function onClickHarvesterMoveToResource() {

    if (this.model.unit.module.harvesterPreferredResourceType) {
        this.model.unit.module.collectResources(this.model.unit.module.harvesterPreferredResourceType);
    }
}

function onChangeVehicleDepot(e) {
    console.log('onChangeVehicleDepot', e.target.value);
    this.model.unit.module.vehiclePreferredDepotUnit = e.target.value;
}

function onChangeTransporterStorage(e) {
    console.log('onChangeTransporterStorage', e.target.value);
    this.model.unit.module.transporterPreferredStorageUnit = e.target.value;
}

function onChangeVehicleResource(e) {
    console.log('onChangeVehicleResource', e.target.value);
    this.model.unit.module.harvesterPreferredResourceType = e.target.value;
}
