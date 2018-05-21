"use strict";

import {
    ITEMS_DATA,
    UNITS as UNIT_TYPES
} from '../../../../game/types';
import lang from '../../../../game/utils/lang';

import Interface from '../../Interface';

export default Interface.extend({

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            availableUnitTypes: {
                type: 'array',
                required: true,
                default () {
                    return [UNIT_TYPES.TELEPORTER];
                }
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        'change [data-hook="unitTeleporterItemsDropdown"]': onChangeTeleporterItems
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);

        this.elements = Object.assign(this.elements, {
            unitTeleporterItemsDropdown: this.queryByHook('unitTeleporterItemsDropdown')
        });
    },

    onSelectUnit(unit) {
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (unit && this.isAvailableUnit(unit)) {
            this.render(unit.module);
            this.model.visible = true;
        } else {
            this.model.visible = false;
        }
    },

    render() {

        this.elements.unitTeleporterItemsDropdown.innerHTML = '';
        mapUnitTypes(ITEMS_DATA.map(data => {
            return data.type;
        })).forEach(type => {
            this.elements.unitTeleporterItemsDropdown.appendChild(this.tmpl.dropdownItem.toFragment(type));
        });
        Array.from(this.elements.unitTeleporterItemsDropdown.querySelectorAll('option')).forEach(option => {
            console.log(option,option.value);
            option.selected = this.model.selectedUnit.module.teleporterRequestedItems.indexOf(option.value) !== -1;
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
                const options = mapUnitTypes(value);
                if (options.length > 0) {
                    result.push({
                        title: `${lang.get(value.DEFAULT)}`,
                        value: value.DEFAULT,
                        options: mapUnitTypes(value)
                    });
                }
            }
        }
    });
    return result;
}

// function getFlatList(items, result = []) {
//     return Object.values(items).reduce((result, item) => {
//         if (typeof item === 'object') {
//             getFlatList(item, result);
//         } else {
//             result.push(item);
//         }
//         return result;
//     }, result);
// }

/*
 * Events
 */

function onChangeTeleporterItems(e) {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    this.model.selectedUnit.module.teleporterRequestedItems = options;
}
