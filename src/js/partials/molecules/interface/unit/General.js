"use strict";

import {
    UNITS as UNIT_TYPES
} from '../../../../game/types';

import Interface from '../../Interface';

export default Interface.extend({

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            availableUnitTypes: {
                type: 'array',
                required: true,
                default () {
                    return [];
                }
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        'change [data-hook="unitGeneralActiveDropdown"]': onChangeActive,
        'change [data-hook="unitGeneralUserDropdown"]': onChangeUser
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        this.elements = Object.assign(this.elements, {
            active: this.queryByHook('unitGeneralActiveDropdown'),
            user: this.queryByHook('unitGeneralUserDropdown'),
            form: this.queryByHook('unitGeneralForm')
        });
    },

    onAppReady() {
        Interface.prototype.onAppReady.apply(this, arguments);
        this.render();
    },

    onSelectUnit(unit) {
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (unit) {
            this.renderUnit(unit);
        } else {
            this.elements.form.reset();
        }
        console.log('??');
    },

    renderUnit(unit) {
        this.elements.active.value = unit.active ? '1' : '0';
        if (unit.isType(UNIT_TYPES.USER)) {
            console.log(unit);
            if (unit.user) {
                console.log(unit.user.id);
                this.elements.user.value = unit.user.id;
            } else {
                this.elements.user.selectedIndex = 0;
            }
            this.elements.user.classList.remove('js--hide');
        } else {
            this.elements.user.classList.add('js--hide');
        }
    },

    render() {
        this.elements.user.innerHTML = '';
        this.elements.user.appendChild(this.tmpl.dropdownItem.toFragment({
            title: 'No Player',
            value: '0'
        }));
        this.targetModel.app.users.forEach(user => {
            this.elements.user.appendChild(this.tmpl.dropdownItem.toFragment({
                title: user.name,
                value: user.id
            }));
        });
    }


});

/*
 * Functions
 */

/*
 * Events
 */

function onChangeActive(e) {
    let result = false;
    if (e.target.value === '1') {
        result = true;
    }
    this.model.selectedUnit.active = result;
}

function onChangeUser(e) {
    const user = this.targetModel.app.getUser(e.target.value);
    console.log(this.targetModel.app.users, e.target.value, user);
    if (user) {
        this.model.selectedUnit.user = user;
    }
}
