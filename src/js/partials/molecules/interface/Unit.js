'use strict';

import {
    UNITS as UNIT_TYPES
} from '../../../game/types';

import Interface from '../Interface';

export default Interface.extend({

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {

            tabs: {
                type: 'array',
                required: true,
                default () {
                    return [
                        ['info'],
                        ['vehicle', UNIT_TYPES.VEHICLE.DEFAULT],
                        ['storage', UNIT_TYPES.ITEM_STORAGE],
                        ['depot', UNIT_TYPES.UNIT_STORAGE],
                        ['teleporter', UNIT_TYPES.TELEPORTER]
                    ];
                }
            }

        }
    }),




    events: Object.assign({}, Interface.prototype.events, {}),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);

        // this.model.once('change:tabContainer', (model, tabContainer) => {
        //     tabContainer.openByName('storage');
        // });
    },

    onAppReady(app) {
        Interface.prototype.onAppReady.apply(this, arguments);
        if (app.unitSelect && app.unitSelect.selectedUnits.length > 0) {
            this.register(app.unitSelect.selectedUnits[0]);
        }
    },

    onSelectUnit(unit) {
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (this.model.unit) {
            this.unregister(this.model.unit);
        }
        if (unit) {
            this.register(unit);
        }
        this.model.visible = !!unit;
    },


    register(unit) {
        this.model.unit = unit;
        this.setupUnit(unit);
        this.model.tabContainer.openByName('info');
    },

    unregister() {
        this.model.unit = null;

    },


    setupUnit(unit) {


        this.model.tabs.forEach(tab => {
                if (tab.length > 1 && unit.isType(tab[1]) || tab.length === 1 && !!unit) {
                    this.model.tabContainer.showTab(tab[0]);
                } else {
                    this.model.tabContainer.hideTab(tab[0]);
                }
        });

    }

});
