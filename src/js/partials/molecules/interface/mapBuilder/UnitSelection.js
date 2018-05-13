'use strict';

import Interface from '../../Interface';

import Template from '../../../../base/Template';
import itemTmpl from './tmpl/unitSelectionItem.hbs';

import {
    SPRITE_CLASSES
} from '../../../../game/types';

export default Interface.extend({

    itemTmpl: new Template(itemTmpl),

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            selectedId: {
                type: 'string',
                required: true
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        'click li': onClickItem
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        this.elements.list = this.queryByHook('unitSelectionItems');
        this.model.on('change:selectedId', onChangeSelectedId, this);
        this.renderItems();
    },

    renderItems() {
        this.elements.list.innerHTML = '';
        Object.keys(SPRITE_CLASSES).forEach(key => this.elements.list.appendChild(this.itemTmpl.toFragment({
            id: key,
            name: key
        })));
    }

});


// Model Events

function onChangeSelectedId(model, selectedId) {
    if (this.elements.list.querySelector(`[data-id].js--selected`)) {
        this.elements.list.querySelector(`[data-id].js--selected`).classList.remove('js--selected');
    }
    this.elements.list.querySelector(`[data-id="${selectedId}"]`).classList.add('js--selected');
    this.targetModel.app.selectedUnitType = selectedId;
}

// Dom Events

function onClickItem(event) {
    this.model.selectedId = event.delegateTarget.dataset.id;
}
