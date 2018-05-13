"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';
import viewport from 'gp-module-viewport';

import Template from '../../base/Template';
import listItemTmpl from '../../tmpl/listItem.hbs';
import dropdownItemTmpl from '../../tmpl/dropdownItem.hbs';

export default Controller.extend({

    tmpl: {
        listItem: new Template(listItemTmpl),
        dropdownItem: new Template(dropdownItemTmpl),
    },

    modelConstructor: DomModel.extend({
        session: {
            visible: {
                type: 'boolean',
                required: true,
                default: true
            },
            selectedUnit: {
                type: 'object',
                required: false
            },
            availableUnitTypes: {
                type: 'array',
                required: true,
                default () {
                    return [];
                }
            }
        }
    }),

    bindings: {
        'model.visible': {
            type: 'booleanClass',
            name: 'js--visible'
        }
    },

    events: {},


    initialize() {
        Controller.prototype.initialize.apply(this, arguments);
        this.elements = {};
        viewport.on(viewport.EVENT_TYPES.INIT, this.onViewportInit.bind(this));
        this.model.on('change:visible', (model, visible) => {
            if (visible) {
                this.onViewportResize();
            }
        });
        if (this.targetModel) {
            this.targetModel.on('change:app', (model, app) => app.ready.then(this.onAppReady.bind(this)));
        }
    },

    // Functions

    // Events

    onAppReady(app) {
        if (app.unitSelect) {
            app.unitSelect.on('select', this.onSelectUnit, this);
        }
    },

    onSelectUnit(unit) {
        if (!unit && this.model.selectedUnit) {
            this.model.selectedUnit.off(null, null, this);
            if (this.model.selectedUnit.ready) {
                this.model.selectedUnit.module.off(null, null, this);
            }
        }
        if (unit && this.isAvailableUnit(unit)) {
            this.model.selectedUnit = unit;
        }
    },

    isAvailableUnit(unit) {
        return this.model.availableUnitTypes.length === 0 || isType(unit, this.model.availableUnitTypes);
    },

    onViewportInit() {
        viewport.on(viewport.EVENT_TYPES.RESIZE, this.onViewportResize.bind(this));
        this.onViewportResize.bind(this)();
    },

    onViewportResize() {
        if (this.model.isHorizontalCenterPositioning || this.model.isVerticalCenterPositioning) {
            this.setPosition();
        }
    }
});

function isType(unit, types) {
    return types.find(type => unit.isType(type));
}
