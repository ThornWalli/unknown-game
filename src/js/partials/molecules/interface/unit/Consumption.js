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
                    return [UNIT_TYPES.CONSUMPTION];
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
            consumptions: this.queryByHook('consumptionsTable')
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
        const rows = [{
                "head": true,
                "cells": ['Item', 'Capacity / Max. Capacity', 'Cost']
            }];

        this.model.selectedUnit.module.on('change.consumption.value', (consumption) => {
            console.log('change.consumption.value',consumption);
        });

        this.model.selectedUnit.module.consumptions.forEach(consumption => {
            let styleClass = [];
            if (consumption.isEmpty()) {
                styleClass.push('table__row--error');
            } else if (consumption.isWarning()) {
                styleClass.push('table__row--warning');
            }
            rows.push({
                class: styleClass.join(' '),
                cells: [lang.get(consumption.type), `${consumption.capacity} / ${consumption.maxCapacity}`, consumption.value]
            });
        });
        this.elements.consumptions.innerHTML = this.tmpl.tableContentTmpl.toText({
            "rows": rows
        });

        // this.elements.unitTeleporterItemsDropdown.innerHTML = '';
        // mapUnitTypes(ITEMS_DATA.map(data => {
        //     return data.type;
        // })).forEach(type => {
        //     this.elements.unitTeleporterItemsDropdown.appendChild(this.tmpl.dropdownItem.toFragment(type));
        // });
        // Array.from(this.elements.unitTeleporterItemsDropdown.querySelectorAll('option')).forEach(option => {
        //     console.log(option,option.value);
        //     option.selected = this.model.selectedUnit.module.teleporterRequestedItems.indexOf(option.value) !== -1;
        // });
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
