'use strict';

import SyncPromise from 'sync-p';

import Events from './base/Events';

import {
    UNITS as UNIT_TYPES
} from './types';

/**
 * RuntimeObserver
 * Sammelt alle Benutzer spezifischen Daten zur Laufzeit.
 * zBsp.: Liste aller vorhandenen Rohstoffe.
 */
export default class RuntimeObserver extends Events {
    constructor(app) {
        super();
        this.app = app;

        this._resources = {};

        this._buildings = this.getBuildings();
        this.onChangeBuildings();

        this._depots = this._buildings.filter(building => building.isType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT));
        this.onChangeDepots();
        this._storages = this._buildings.filter(building => building.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT));
        this.onChangeStorages();

        this._vehicles = this.getVehicles();
        this.onChangeVehicles();

        this.setup();
    }

    setup() {

        // Request Transporter Queue

        this._requestTransporterQueue = [];
        this.on('change.depots.vehicles', (depots) => {
            const transporters = depots.reduce((result, depot) => {
                result = result.concat(depot.module.unitStorageUnits.items);
                return result;
            }, []);
            if (transporters.length > 0) {
                this._requestTransporterQueue.shift()(transporters);
            }
        }, this);


        this._storages.forEach(unit => unit.module.on('storage.value.add', this.onChangeResources, this));
        this._depots.forEach(unit => unit.module.on('add.storage.units', this.onChangeDepotVehicles, this));
        this.app.map.units.on('add', unit => {
            if (unit.isType(UNIT_TYPES.BUILDING.DEFAULT) && isUserUnit(this.app, unit)) {
                this._buildings.push(unit);
                this.onChangeBuildings();
            }
            if (unit.isType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT) && isUserUnit(this.app, unit)) {
                unit.module.on('add.storage.units', this.onChangeResources, this);
                this._depots.push(unit);
                this.onChangeDepots();
            }
            if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && isUserUnit(this.app, unit)) {
                unit.module.on('storage.value.add', this.onChangeResources, this);
                this._storages.push(unit);
                this.onChangeStorages();
            }
            if (unit.isType(UNIT_TYPES.VEHICLE.DEFAULT) && isUserUnit(this.app, unit)) {
                this._vehicles.push(unit);
                this.onChangeVehicles();
            }
        });

        this.app.map.units.on('remove', unit => {
            if (unit.isType(UNIT_TYPES.BUILDING.DEFAULT) && isUserUnit(this.app, unit)) {
                this._buildings.splice(this._buildings.indexOf(unit), 1);
                this.onChangeBuildings();
            }
            if (unit.isType(UNIT_TYPES.BUILDING.DEPOT.DEFAULT) && isUserUnit(this.app, unit)) {
                this._depots.splice(this._depots.indexOf(unit), 1);
                this.onChangeDepots();
            }
            if (unit.isType(UNIT_TYPES.VEHICLE.DEFAULT) && isUserUnit(this.app, unit)) {
                this._vehicles.splice(this._vehicles.indexOf(unit), 1);
                this.onChangeVehicles();
            }
            if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && isUserUnit(this.app, unit)) {
                this._storages.splice(this._storages.indexOf(unit), 1);
                this.onChangeStorages();
            }
        });

    }


    // Functions

    getStorages() {
        return this.app.map.getUnitsByType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT).filter(unit => {
            if (isUserUnit(this.app, unit)) {
                return unit;
            }
        });
    }
    getVehicles() {
        return this.app.map.getUnitsByType(UNIT_TYPES.VEHICLE.DEFAULT).filter(unit => {
            if (isUserUnit(this.app, unit)) {
                return unit;
            }
        });
    }
    getBuildings() {
        return this.app.map.getUnitsByType(UNIT_TYPES.BUILDING.DEFAULT).filter(unit => {
            if (isUserUnit(this.app, unit)) {
                return unit;
            }
        });
    }

    /**
     * Ruft einen freien Transporter.
     * @param {game.types.items} type
     */
    requestTransporter() {
        const transporters = this.vehicles.filter(unit => unit.isType(UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT) && !unit.activeAction);
        if (transporters.length > 0) {
            return transporters.shift();
        }
    }

    requestTransporters() {
        return new SyncPromise(resolve => {
            const transporters = this.vehicles.filter(unit => unit.isType(UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT) && !unit.activeAction);

            if (transporters.length > 0) {
                return resolve(transporters);
            } else {
                this._requestTransporterQueue.push(resolve);
            }
        });

    }



    // Properties

    get buildings() {
        return [].concat(this._buildings);
    }
    get depots() {
        return [].concat(this._depots);
    }
    get storages() {
        return [].concat(this._storages);
    }
    get resources() {
        return Object.assign({}, this._resources);
    }
    get vehicles() {
        return [].concat(this._vehicles);
    }

    // Events

    onChangeBuildings() {
        this.trigger('change.buildings', this.buildings);
    }
    onChangeDepots() {
        this.trigger('change.depots', this.depots);
    }
    onChangeDepotVehicles() {
        this.trigger('change.depots.vehicles', this.depots);
    }
    onChangeStorages() {
        this.trigger('change.storages', this.storages);
    }
    onChangeVehicles() {
        this.trigger('change.vehicles', this.vehicles);
    }
    onChangeResources() {
        const units = this.getStorages();
        this._resources = Object.assign(this._resources, units.reduce((result, unit) => {
            Object.keys(unit.module.itemStorageItems).forEach(key => {
                result[key] = (result[key] || 0) + unit.module.itemStorageItems[key];
            });
            return result;
        }, {}));
        this.trigger('change.resources', this._resources);
        this.onChangeStorages();
    }

}

function isUserUnit(app, unit) {
    if (app.user.is(unit.user)) {
        return true;
    }
}
