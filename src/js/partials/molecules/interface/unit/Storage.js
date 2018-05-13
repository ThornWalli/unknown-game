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
    renderUnitTypes(this.elements.storageAllowedItemsMultiselect, ITEMS);

}

function renderUnitTypes(el, data) {
    const html = [];
    Object.keys(data).forEach(key => {
        const value = data[key];
        if (key !== 'DEFAULT') {
            if (typeof value === 'string') {
                html.push('<option value="' + value + '">' + lang.get(value) + '</option>');
            } else {
                html.push('<optgroup label="' + lang.get(value.DEFAULT) + '">' + '<option value="' + value.DEFAULT + '">' + lang.get(value.DEFAULT) + ' (Default)</option>' + renderUnitTypes(null, value) + '</optgroup>');
            }
        }
    });
    if (el) {
        el.innerHTML = html.join();
    }
    return html;
}

/*
 * Events
 */

function onChangeStorageAllowedItemsMultiselect() {

}
