'use strict';

import lang from '../../../game/utils/lang';
import Dialog from '../Dialog';

import Template from '../../../base/Template';
import tableContentTmpl from '../../../tmpl/tableContent.hbs';



export default Dialog.extend({

    tableContentTmpl: new Template(tableContentTmpl),

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {}
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);

        this.elements.resources = this.queryByHook('detaiInfo_resources');
        this.elements.storages = this.queryByHook('detaiInfo_storages');
        this.elements.vehicles = this.queryByHook('detaiInfo_vehicles');
        this.elements.buildings = this.queryByHook('detaiInfo_buildings');





    },

    onOpened() {


    },

    onClosed() {
        this.destroy();
    },

    onAppReady(app) {
        console.log('onAppReady', app);
        this.render(app);
        this.targetModel.app.runtimeObserver.on('change.resources', this.onRefreshResources, this)
            .on('change.buildings', this.onRefreshBuildings, this)
            .on('change.storages', this.onRefreshStorages, this)
            .on('change.vehicles', this.onRefreshVehicles, this);

        this.interval = global.setInterval(() => {
            this.render(app);
        }, 10000);
    },

    onRefresh() {
        this.render(this.model.app);
    },


    onRefreshResources() {
        const app = this.targetModel.app,
            rows = [{
                "head": true,
                "cells": ['Name', "Value"]
            }];
        Object.keys(app.runtimeObserver.resources).forEach(key => {
            rows.push({
                cells: [lang.get(key), app.runtimeObserver.resources[key]]
            });
        });
        this.elements.resources.innerHTML = this.tableContentTmpl.toText({
            "rows": rows
        });

    },

    onRefreshStorages() {
        const app = this.targetModel.app,
            rows = [{
                "head": true,
                "cells": ['Name', "Value"]
            }];
        app.runtimeObserver.storages.forEach(storage => {
            let styleClass = [];
            if ((storage.module.maxItemStorageItemValue - storage.module.getFreeItemStorageValue()) === storage.module.maxItemStorageItemValue) {
                styleClass.push('table__row--error');
            }
            rows.push({
                class: styleClass,
                cells: [lang.get(storage.type), `${storage.module.maxItemStorageItemValue - storage.module.getFreeItemStorageValue()} / ${storage.module.maxItemStorageItemValue}`]
            });
        });
        this.elements.storages.innerHTML = this.tableContentTmpl.toText({
            "rows": rows
        });
    },

    onRefreshBuildings() {
        const app = this.targetModel.app,
            rows = [{
                "head": true,
                "cells": ['Name', 'Position']
            }];
        app.runtimeObserver.buildings.forEach(building => {
            rows.push({
                cells: [lang.get(building.type), `${building.position.x} / ${building.position.y}`]
            });
        });
        this.elements.buildings.innerHTML = this.tableContentTmpl.toText({
            "rows": rows
        });
    },

    onRefreshVehicles() {
        const app = this.targetModel.app,
            rows = [{
                "head": true,
                "cells": ['Name', "Value", "Storage"]
            }];
        app.runtimeObserver.vehicles.forEach(vehicle => {
            const items = [];
            Object.keys(vehicle.module.itemStorageItems).forEach(key => {
                items.push(`${key}: ${vehicle.module.itemStorageItems[key]}`);
            });
            let styleClass = [];
            if ((vehicle.module.maxItemStorageItemValue - vehicle.module.getFreeItemStorageValue()) === vehicle.module.maxItemStorageItemValue) {
                styleClass.push('table__row--warning');
            }
            rows.push({
                class: styleClass,
                cells: [lang.get(vehicle.type), `${vehicle.module.maxItemStorageItemValue - vehicle.module.getFreeItemStorageValue()} / ${vehicle.module.maxItemStorageItemValue}`, items]
            });
        });
        this.elements.vehicles.innerHTML = this.tableContentTmpl.toText({
            "rows": rows
        });
    },



    render() {


        this.onRefreshResources();
        this.onRefreshBuildings();
        this.onRefreshStorages();
        this.onRefreshVehicles();
        // rows.concat([{
        //     "cells": ["Cell 1.", "Cell 1.2."]
        // }, {
        //     "cells": ["Cell 2.1.", "Cell 2.2."]
        // }, {
        //     "cells": ["Cell 3.1.", "Cell 3.2."]
        // }]);



        // Resources

        // Storages

    }

});
