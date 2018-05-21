"use strict";

import lang from '../../../../game/utils/lang';
import {
    UNITS as UNIT_TYPES
} from '../../../../game/types';

import Interface from '../../Interface';

import Template from '../../../../base/Template';
import depotItemTmpl from './tmpl/depotItem.hbs';


export default Interface.extend({

    depotItemTmpl: new Template(depotItemTmpl),

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            availableUnitTypes: {
                type: 'array',
                required: true,
                default () {
                    return [UNIT_TYPES.UNIT_STORAGE];
                }
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        'click [data-hook="unitDepotItemsStart"]': onClickDepotItem
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        this.elements = Object.assign(this.elements, {
            depotItems: this.queryByHook('unitDepotItems'),
        });
    },

    onSelectUnit(unit) {
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (unit && this.isAvailableUnit(unit)) {
            this.render(unit.module);
            unit.module
                .on('add.storage.units', this.render, this)
                .on('remove.storage.units', this.render, this);
        }
        this.model.visible = !!unit;
    },
    render(module) {
        this.elements.depotItems.innerHTML = '';
        module.unitStorageUnits.forEach(unit => {
            this.elements.depotItems.appendChild(this.depotItemTmpl.toFragment({
                id: unit.id,
                name: lang.get(unit.type)
            }));
        });
    }

});



/*
 * Events
 */

function onClickDepotItem(e) {
    const unit = this.model.selectedUnit.module.app.map.getUnitById(e.delegateTarget.dataset.id);
    console.log(unit);
    unit.module.unpark();
}
