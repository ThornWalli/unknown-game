'use strict';

import Interface from '../Interface';

import Template from '../../../base/Template';
import itemTmpl from './tmpl/item.hbs';

import lang from '../../../game/utils/lang';

// import {
//     UNITS as UNIT_TYPES
// } from '../../../game/types';

export default Interface.extend({

    itemTmpl: new Template(itemTmpl),

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {}
    }),

    events: Object.assign({}, Interface.prototype.events, {}),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        this.elements = {
            resourcesList: this.queryByHook('generalInfoResourcesList'),
            vehiclesList: this.queryByHook('generalInfoVehiclesList'),
            buildingsList: this.queryByHook('generalInfoBuildingsList')
        };
    },

    onAppReady(app) {
        onChangeResources.bind(this)(app.runtimeObserver.resources);
        onChangeVehicles.bind(this)(app.runtimeObserver.vehicles);
        onChangeBuildings.bind(this)(app.runtimeObserver.buildings);
        app.runtimeObserver.on('change.resources', onChangeResources, this);
        app.runtimeObserver.on('change.vehicles', onChangeVehicles, this);
        app.runtimeObserver.on('change.buildings', onChangeBuildings, this);
    }
});

function onChangeResources(resources) {
    this.elements.resourcesList.innerHTML = '';
    Object.keys(resources).forEach(key => this.elements.resourcesList.appendChild(this.itemTmpl.toFragment({
        name: lang.get(key),
        value: resources[key]
    })));
}

function onChangeVehicles(vehicles) {
    this.elements.vehiclesList.innerHTML = '';
    vehicles.forEach(vehicle => this.elements.vehiclesList.appendChild(this.itemTmpl.toFragment({
        name: lang.get(vehicle.type)
    })));
}

function onChangeBuildings(buildings) {
    this.elements.buildingsList.innerHTML = '';
    buildings.forEach(building => {
        // if (building.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT)) {
        //     this.elements.storagesList.appendChild(this.itemTmpl.toFragment({
        //         name: lang.get(building.type)
        //     }));
        // }
        this.elements.buildingsList.appendChild(this.itemTmpl.toFragment({
            name: lang.get(building.type)
        }));
    });
}
