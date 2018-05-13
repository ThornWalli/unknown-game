"use strict";
import {
    ITEMS,
    UNITS as UNIT_TYPES
} from '../../../../game/types';

import Interface from '../../Interface';

import lang from '../../../../game/utils/lang';

export default Interface.extend({

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
        'change [data-hook="unitStorageAllowedItemsMultiselect"]': onChangeStorageAllowedItemsMultiselect
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
                .on('storage.value.add', render, this)
                .on('storage.value.remove', render, this)
                .on('storage.value.transfer', render, this);
            render.bind(this)(unit.module);
        }
        this.model.visible = !!unit;
    }

});


function render(module) {
    let html = '';
    Object.keys(module.itemStorageItems).forEach(key => {
        html += `${lang.get(key)}: ${module.itemStorageItems[key]}<br />`;
    });
    this.elements.storageItems.innerHTML = html;

    this.elements.storageAllowedItemsMultiselect.innerHTML = '';
    // console.log(UNIT_TYPES, pick(UNIT_TYPES, ['RESOURCE']));
        let data = mapUnitTypes(ITEMS);
        data.forEach(type => this.elements.storageAllowedItemsMultiselect.appendChild(this.tmpl.dropdownItem.toFragment(type)));
        this.model.selectedUnit.module.allowedItemsStorageItems.forEach(type => {
            this.elements.storageAllowedItemsMultiselect.querySelector(`[value="${type}"]`).setAttribute('selected', true);
        });
}



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
                    value: value
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
    console.log('value', this.model.selectedUnit.module);
}
