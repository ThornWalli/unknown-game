'use strict';

import SyncPromise from 'sync-p';

import Events from './base/Events';

import {
    ticker
} from './base/Ticker';

import {
    UNITS as UNIT_TYPES
} from './types';

import {
    getSortedUnitByDistance
} from './utils/unit';

const VEHICLE_TIMEOUT = 2 * 60 * 1000;

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
        this._freeTransporter = new Set(this._vehicles.filter(unit => isTransporter(unit)));
        this.onChangeVehicles();

        this.setup();


        ticker.register(null, () => {
            this._vehicles.forEach(vehicle => {
                const timeDiff = ticker.now() - vehicle.lastAction;
                if (!vehicle.activeAction && (vehicle.lastAction === 0 || (timeDiff) > (5 * 60 * 1000))) {
                    vehicle.module.moveToDepot();
                }
            });
            return true;
        }, VEHICLE_TIMEOUT, false);


    }

    setup() {

        // Request Transporter Queue

        this._requestTransporterQueue = [];
        this.on('change.depots.vehicles', () => {
            const transporters = Array.from(this._freeTransporter);
            if (transporters.length > 0 && this._requestTransporterQueue.length > 0) {
                this._requestTransporterQueue.shift()(transporters);
            }
        }, this);


        this._storages.forEach(unit => unit.module.on('storage.value.add', this.onChangeResources, this));
        this._depots.forEach(unit => unit.module.on('add.storage.units', this.onAddStorageUnitsUnit, this));
        this._depots.forEach(unit => unit.module.on('remove.storage.units', this.onRemoveStorageUnitsUnit, this));
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
                this._vehicles.add(unit);
                if (isTransporter(unit)) {
                    this._freeTransporter.add(unit);
                }
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
                if (isTransporter(unit)) {
                    this._freeTransporter.delete(unit);
                }
                this.onChangeVehicles();
            }
            if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && isUserUnit(this.app, unit)) {
                this._storages.splice(this._storages.indexOf(unit), 1);
                this.onChangeStorages();
            }
        });


this._solars = 0;
        this._energy = 0;
        this._water = 0;
        this._food = 0;
    }

    get solars() {
        return this._solars;
    }
    get energy() {
        return this._energy;
    }
    get water() {
        return this._water;
    }
    get food() {
        return this._food;
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
    getEnergy() {
        return this.app.map.getUnitsByType(UNIT_TYPES.POWER_GENERATION.DEFAULT).filter(unit => {
            if (isUserUnit(this.app, unit)) {
                return unit;
            }
        });
    }

    hasFreeItemStorages(key) {
        return this._storages.some(storage => {
            return storage.module.getFreeItemStorageValue(key);
        });
    }

    /**
     * Ruft einen freien Transporter.
     * @param {game.types.items} type
     */
    requestTransporter() {
        return this.requestTransporters().then(transporters => {
            this._freeTransporter.delete(transporters[0]);
            return transporters[0];
        });
    }

    requestTransporters() {
        return new SyncPromise(resolve => {
            const transporters = this._freeTransporter;
            if (transporters.size > 0) {
                return resolve(Array.from(transporters));
            } else {
                this._requestTransporterQueue.push(resolve);
            }
        }).catch(e => {
            throw e;
        });

    }

    getStoragesByDistance(position) {
        const storages = getSortedUnitByDistance(position, this._buildings.filter(building => {
            return building.active && building.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && building.isType(UNIT_TYPES.ITEM_STORAGE);
        }));
        storages.forEach((storage, i, storages) => {
            storages[i] = storage.unit;
        });
        return storages;
    }

    getFreeStorage(position, item, units = [], ignore = true) {
        const storages = this.getStoragesByDistance(position);
        return storages.find(storage => (units.length < 1 || !ignore && units.indexOf(storage) > -1 || ignore && units.indexOf(storage) === -1) && storage.module.isFreeAndAllowedItem(item));
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
    get freeTransporter() {
        return [].concat(this._freeTransporter);
    }

    // Events

    onChangeBuildings() {
        this.trigger('change.buildings', this.buildings);
    }
    onChangeDepots() {
        this.trigger('change.depots', this.depots);
    }

    onAddStorageUnitsUnit(storage, unit) {
        if (isTransporter(unit)) {
            this._freeTransporter.add(unit);
            this.trigger('change.depots.vehicles', this.depots);
        }
    }
    onRemoveStorageUnitsUnit(storage, unit) {
        if (isTransporter(unit)) {
            this._freeTransporter.delete(unit);
        }
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

function isTransporter(unit) {
    return unit.isType(UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT);
}

function isUserUnit(app, unit) {
    if (app.user.is(unit.user)) {
        return true;
    }
}
