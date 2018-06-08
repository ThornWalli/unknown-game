'use strict';

import Interface from '../Interface';

import Template from '../../../base/Template';
import itemTmpl from './mapBuilder/tmpl/unitSelectionItem.hbs';

import lang from '../../../game/utils/lang';

import UnitSelect from '../../../game/components/UnitSelect';

import {
    UNITS_DATA,
    SPRITE_CLASSES
} from '../../../game/types';

export default Interface.extend({

    itemTmpl: new Template(itemTmpl),

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            selectedUnitType: {
                type: 'string',
                required: false
            },
            extended: {
                type: 'boolean',
                required: true
            },
            unitSelect: {
                type: 'object',
                required: false
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        'click li': onClickItem,
        'click [data-hook="unitSelectionRemoveSelectedUnits"]': onClickRemoveSelectedUnits
    }),

    bindings: Object.assign({}, Interface.prototype.bindings, {
        'model.selectedUnitType': {
            type: 'booleanClass',
            name: 'js--selected-type'
        }
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        this.elements.list = this.queryByHook('unitSelectionItems');
        this.elements.info = this.queryByHook('addUnitInfo');

        this.model.on('change:selectedUnitType', onChangeselectedUnitType, this);
        this.renderItems();
    },

    onViewportInit() {
        if (this.targetModel) {
            if (this.targetModel.app) {
                onChangeTargetApp.bind(this)(this.targetModel, this.targetModel.app);
            } else {
                this.targetModel.once('change:app', onChangeTargetApp, this);
            }
        } else {
            throw new Error('TargetModel is undefined…');
        }
        Interface.prototype.onViewportInit.apply(this, arguments);
    },

    renderItems() {
        this.elements.list.innerHTML = '';


        console.log('UNITS_DATA_MAPUNITS_DATA_MAPUNITS_DATA_MAPUNITS_DATA_MAP', UNITS_DATA);

        let types = Object.keys(SPRITE_CLASSES);
        if (!this.model.extended) {
            types = types.filter(key => key in UNITS_DATA);
        }


        types.forEach(key => this.elements.list.appendChild(this.itemTmpl.toFragment({
            id: key,
            name: lang.get(key)
        })));
    }

});


// Model Events

function onChangeselectedUnitType(model, selectedUnitType) {
    if (this.elements.list.querySelector(`[data-id].js--selected`)) {
        this.elements.list.querySelector(`[data-id].js--selected`).classList.remove('js--selected');
    }
    let infos;
    if (selectedUnitType) {
        this.elements.list.querySelector(`[data-id="${selectedUnitType}"]`).classList.add('js--selected');

        const infoData = UNITS_DATA[selectedUnitType];
        infos = [
            `<strong>${infoData.title}</strong>`,
            `${infoData.description}`,
            `Energy: ${infoData.energy}`, '',


        ];

        if (infoData.costs && Object.keys(infoData.costs).length > 0) {
            infos.push(`Costs:`);
            Object.keys(infoData.costs).forEach(key => {
                infos.push(`${lang.get(key)}: ${infoData.costs[key]}`);
            });
        }

        if (infoData.consumptions && Object.keys(infoData.consumptions).length > 0) {
            infos.push(`Consumptions:`);
            infoData.consumptions.forEach(consumption => {
                infos.push(`${lang.get(consumption.type)}: ${consumption.value} / ${consumption.maxCapacity}`);
            });
        }


    } else {
        infos = [];
    }
    this.elements.info.innerHTML = infos.join('<br />');
    this.model.unitSelect.setUnitType(selectedUnitType);
}

// Dom Events

function onClickRemoveSelectedUnits() {
    this.model.unitSelect.removeSelectedUnits();
}

function onClickItem(event) {
    if (this.model.selectedUnitType === event.delegateTarget.dataset.id) {
        this.model.selectedUnitType = null;
    } else {
        this.model.selectedUnitType = event.delegateTarget.dataset.id;
    }
}

function onChangeTargetApp(model, app) {
    app.ready.then(() => {
        this.model.unitSelect = new UnitSelect(app);
    });
}
