"use strict";
import {
    ITEMS,
    UNITS as UNIT_TYPES
} from '../../../../game/types';

import Interface from '../../Interface';

import lang from '../../../../game/utils/lang';

import Template from '../../../../base/Template';
import storageItemTmpl from './tmpl/storageItem.hbs';

export default Interface.extend({

    storageItemTmpl: new Template(storageItemTmpl),

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            availableUnitTypes: {
                type: 'array',
                required: true,
                default () {
                    return [UNIT_TYPES.ITEM_STORAGE];
                }
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        'change [data-hook="unitStorageAllowedItemsMultiselect"]': onChangeStorageAllowedItemsMultiselect,
        'click [data-hook="unitStorageCleanStorage"]': onClickCleanStorageButton,
        'click [data-hook="unitStorageItemDiscard"]': onClickItemDiscardButton
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        this.elements = Object.assign(this.elements, {
            storageItems: this.queryByHook('unitStorageItems'),
            storageAllowedItemsMultiselect: this.queryByHook('unitStorageAllowedItemsMultiselect'),
        });
    },

    onSelectUnit(unit) {
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (unit && this.isAvailableUnit(unit)) {
            unit.module
                .on('storage.value.add', this.render, this)
                .on('storage.value.remove', this.render, this)
                .on('storage.value.transfer', this.render, this);
            this.render(unit.module);
        }
        this.model.visible = !!unit;
    },

    render(module) {
        this.elements.storageItems.innerHTML = '';
        Object.keys(module.itemStorageItems).forEach(key => {
            this.elements.storageItems.appendChild(this.storageItemTmpl.toFragment({
                name: `${lang.get(key)}: ${module.itemStorageItems[key]}`,
                id: key
            }));
        });

        this.elements.storageAllowedItemsMultiselect.innerHTML = '';
        // console.log(UNIT_TYPES, pick(UNIT_TYPES, ['RESOURCE']));
        let data = mapUnitTypes(ITEMS);
        data.forEach(type => this.elements.storageAllowedItemsMultiselect.appendChild(this.tmpl.dropdownItem.toFragment(type)));
        this.model.selectedUnit.module.allowedItemsStorageItems.forEach(type => {
            this.elements.storageAllowedItemsMultiselect.querySelector(`[value="${type}"]`).setAttribute('selected', true);
        });
    }

});





/*
 * Functions
 */

function mapUnitTypes(types) {
    const result = [];
    Object.keys(types).forEach(key => {
        const value = types[key];
        if (key !== 'DEFAULT') {
            if (typeof value === 'string') {
                result.push({
                    title: `${lang.get(value)}`,
                    value: value
                });
            } else {
                const options = [{
                    title: `${lang.get(value.DEFAULT)} (Default)`,
                    value: value.DEFAULT
                }].concat(mapUnitTypes(value));
                result.push({
                    title: `${lang.get(value.DEFAULT)}`,
                    value: value.DEFAULT,
                    options
                });
            }
        }
    });
    return result;
}

/*
 * Events
 */

function onChangeStorageAllowedItemsMultiselect(e) {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    this.model.selectedUnit.module.allowedItemsStorageItems = options;
}

function onClickCleanStorageButton() {
    this.model.selectedUnit.module.requestTransporterToEmpty();
}

function onClickItemDiscardButton(e) {
    const item = e.target.dataset.id;
    this.model.selectedUnit.module.removeItemStorageItemValue(item, this.model.selectedUnit.module.getItemStorageItemValue(item));
    this.render(this.model.selectedUnit.module);
}
