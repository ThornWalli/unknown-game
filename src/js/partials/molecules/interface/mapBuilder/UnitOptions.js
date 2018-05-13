'use strict';

import {
    UNITS as UNIT_TYPES
} from '../../../../game/types';
import Interface from '../../Interface';

import Template from '../../../../base/Template';
import dropdownOptionTmpl from '../../../../tmpl/dropdownItem.hbs';


export default Interface.extend({

    dropdownOptionTmpl: new Template(dropdownOptionTmpl),

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            unit: {
                type: 'object',
                required: false
            },
            visible: {
                type: 'boolean',
                required: true,
                default: false
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        'change [data-hook="unitOptionsUserDropdown"]': onChangeUser
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        this.elements.user = this.queryByHook('unitOptionsUserDropdown');
        this.elements.form = this.queryByHook('unitOptionsForm');
    },

    onAppReady(app) {
        if (app.unitSelect) {
            app.unitSelect.on('select', unit => {
                this.model.unit = unit;
                if (unit) {
                    this.renderUnit(unit);
                } else {
                    this.elements.form.reset();
                }
                this.model.visible = !!unit;

            });
        }
        this.render();

    },
    renderUnit(unit) {
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
        this.elements.user.appendChild(this.dropdownOptionTmpl.toFragment({
            title: 'Kein Besitzer',
            value: '0'
        }));
        this.targetModel.app.users.forEach(user => {
            this.elements.user.appendChild(this.dropdownOptionTmpl.toFragment({
                title: user.name,
                value: user.id
            }));
        });
    }

});


// Model Events


function onChangeUser(e) {
    const user = this.targetModel.app.getUser(e.target.value);
    console.log(this.targetModel.app.users, e.target.value, user);
    if (user) {
        this.model.unit.user = user;
    }
}

// Dom Events
