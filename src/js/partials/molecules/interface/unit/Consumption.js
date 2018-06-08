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
            this.setupUnit(unit);
            this.model.visible = true;
        } else {
            this.model.visible = false;
        }
    },

    setupUnit(unit) {
        unit.module.on('consumptions.item.change.capacity', onChangeConsumptionCapacity, this);
    },

    render() {
        const rows = [{
            "head": true,
            "cells": ['Item', 'Capacity / Max. Capacity', 'Cost']
        }];

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
    }

});

/*
 * Functions
 */

/*
 * Events
 */

function onChangeConsumptionCapacity() {
    this.render();
}

function onChangeTeleporterItems(e) {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    this.model.selectedUnit.module.teleporterRequestedItems = options;
}
