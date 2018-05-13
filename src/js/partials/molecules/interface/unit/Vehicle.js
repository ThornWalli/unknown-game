"use strict";

import {
    ITEMS,
    UNITS as UNIT_TYPES,
    getItems
} from '../../../../game/types';
import {
    getFlatList
} from '../../../../game/utils';
import lang from '../../../../game/utils/lang';

import Interface from '../../Interface';

export default Interface.extend({

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            availableUnitTypes: {
                type: 'array',
                required: true,
                default () {
                    return [UNIT_TYPES.VEHICLE.DEFAULT];
                }
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {

        'change [data-hook="unitTransporterStorageDropdown"]': onChangeTransporterStorage,
        'click [data-hook="unitTransporterMoveToStorageButton"]': onClickTransporterMoveToStorage,

        'change [data-hook="unitTransporterPreferredItemDropdown"]': onChangeVehicleResource,
        'click [data-hook="unitTransporterMoveToResourceButton"]': onClickMoveToResource,

        'change [data-hook="unitTransporterDepotDropdown"]': onChangeVehicleDepot,
        'click [data-hook="unitTransporterMoveToDepotButton"]': onClickVehicleMoveToDepot

    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);

        this.elements = Object.assign(this.elements, {

            // Vehicle
            vehicleDepot: this.queryByHook('unitTransporterDepotDropdown'),
            transporterStorageForm: this.queryByHook('unitTransporterStorageForm'),
            transporterStorage: this.queryByHook('unitTransporterStorageDropdown'),

            // Harvester
            transporterPreferredItemForm: this.queryByHook('unitTransporterPreferredItemForm'),
            transporterPreferredItem: this.queryByHook('unitTransporterPreferredItemDropdown')

        });
    },

    onAppReady() {

        Interface.prototype.onAppReady.apply(this, arguments);

    },

    onSelectUnit(unit) {
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (unit && this.isAvailableUnit(unit)) {
            render.bind(this)(unit.module);
        } else {
            if (this.vehicleUnitStorages) {
                this.vehicleUnitStorages.destroy();
            }
            if (this.vehicleItemStorages) {
                this.vehicleItemStorages.destroy();
            }
        }
        // this.elements.transporterStorageForm.setAttribute('disabled', !unit || unit && !unit.isType(UNIT_TYPES.ITEM_STORAGE));
        // this.elements.transporterPreferredItemForm.setAttribute('disabled', !unit || unit && !unit.isType(UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT));
        this.model.visible = !!unit;
    }

});

function render(module) {

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

    // PreferredItem

    let items = null;
    if (module.transporterAvailableItemTypes.length > 0) {
        items = module.transporterAvailableItemTypes.reduce((result, type) => {
            return result.concat(getFlatList(getItems(type)));
        }, []);
    } else {
        items = getFlatList(ITEMS);
    }
    renderItems.bind(this)(items.map(resource => {
        return {
            id: resource,
            title: lang.get(resource)
        };
    }), this.elements.transporterPreferredItem, module.transporterPreferredItemType);
    module.on('change.transporterPreferredItemType', (unit, value) => this.elements.transporterPreferredItem.value = value, this);

}

function addDropdownItem(el, title, value) {
    el.appendChild(this.tmpl.dropdownItem.toFragment({
        value,
        title
    }));
}

function prepareStorage(storages) {
    return storages.map(storage => {
        return {
            title: `${lang.get(storage.type)} (${storage.id})`,
            id: storage.id
        };
    });
}

function renderItems(items, el, value) {
    el.innerHTML = null;
    addDropdownItem.bind(this)(el, el.dataset.defaultTitle || ' ', el.dataset.defaultValue);
    items.forEach(item => addDropdownItem.bind(this)(el, item.title, item.id));
    if (value) {
        el.value = value;
    }
}


function getUnitId(unit) {
    if (unit) {
        return unit.id;
    }
    return null;
}



/*
 * Events
 */

// Vehicle

function onClickTransporterMoveToStorage() {
    if (this.model.selectedUnit.module.transporterPreferredStorageUnit) {
        this.model.selectedUnit.module.moveToStorage(this.model.selectedUnit.module.transporterPreferredStorageUnit);
    }
}

function onClickMoveToResource() {
    this.model.selectedUnit.module.collectItems(this.model.selectedUnit.module.transporterPreferredItemType);
}

function onChangeTransporterStorage(e) {
    console.log('onChangeTransporterStorage', e.target.value);
    this.model.selectedUnit.module.transporterPreferredStorageUnit = this.model.selectedUnit.module.app.map.getUnitById(e.target.value);
}

function onChangeVehicleResource(e) {
    console.log('onChangeVehicleResource', e.target.value);
    this.model.selectedUnit.module.transporterPreferredItemType = e.target.value;
}

function onClickVehicleMoveToDepot() {
    if (this.model.selectedUnit.module.vehiclePreferredDepotUnit) {
        this.model.selectedUnit.module.moveToDepot(this.model.selectedUnit.module.vehiclePreferredDepotUnit);
    }
}

function onChangeVehicleDepot(e) {
    console.log('onChangeVehicleDepot', e.target.value);
    this.model.selectedUnit.module.vehiclePreferredDepotUnit = this.model.selectedUnit.module.app.map.getUnitById(e.target.value);
}
