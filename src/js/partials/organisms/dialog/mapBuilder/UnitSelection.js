'use strict';

import Dialog from '../../Dialog';

import Template from '../../../../base/Template';
import itemTmpl from './tmpl/unitSelectionItem.hbs';

import {
    TYPES as UNIT_TYPES
} from '../../../../game/utils/unit';

export default Dialog.extend({

    itemTmpl: new Template(itemTmpl),

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {
            selectedId: {
                type: 'string',
                required: true
            }
        }
    }),

    events: Object.assign(Dialog.prototype.events, {
        'click li': onClickItem
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
        this.elements.list = this.queryByHook('unitSelectionItems');
        this.model.on('change:selectedId', onChangeSelectedId, this);
        this.renderItems();
    },

    renderItems() {
        this.elements.list.innerHTML = '';
        getXPaths(UNIT_TYPES).forEach(type => this.elements.list.appendChild(this.itemTmpl.toFragment({
            id: type.path,
            name: type.value
        })));
    }

});


function getXPaths(data, path = [], result = []) {


    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
             getXPaths(data[key], path.concat(key), result);
        } else {
            result.push({
                path: path.concat(key).join('.'),
                value: data[key]
            });
        }
    });

    return result;


}

function getUnitTypes(types = UNIT_TYPES) {
    return Object.keys(types).reduce((result, type) => {
        if (typeof types[type] === 'object') {
            result = result.concat(getUnitTypes(types[type]));
        } else {
            result.push(types[type]);
        }
        return result;
    }, []);
}

function getType(id, data) {
    var ids = id.split('.');
    while (ids.length > 0) {
        id = ids.shift();
        data = data[id];
    }
    return data;
}

// Model Events
function onChangeSelectedId(model, selectedId) {
    if (this.elements.list.querySelector(`[data-id].js--selected`)) {
        this.elements.list.querySelector(`[data-id].js--selected`).classList.remove('js--selected');
    }
    this.elements.list.querySelector(`[data-id="${selectedId}"]`).classList.add('js--selected');
console.log('getType(selectedId, UNIT_TYPES)',getType(selectedId, UNIT_TYPES));
    this.targetModel.app.selectedUnitType = getType(selectedId, UNIT_TYPES);
}
// Dom Events
function onClickItem(event) {
    this.model.selectedId = event.delegateTarget.dataset.id;
}
