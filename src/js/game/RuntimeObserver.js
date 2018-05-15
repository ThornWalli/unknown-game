'use strict';

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
        this._storages = [];

        this._buildings = this.getBuildings();
        this.onChangeBuildings();

        this._vehicles = this.getVehicles();
        this.onChangeVehicles();

        this.setup();
    }

    setup() {
        this.app.map.units.on('add', unit => {
            if (unit.isType(UNIT_TYPES.BUILDING.DEFAULT) && isUserUnit(this.app, unit)) {
                this._buildings.push(unit);
                this.onChangeBuildings();
            }
        });
        this.app.map.units.on('remove', unit => {
            if (unit.isType(UNIT_TYPES.BUILDING.DEFAULT) && isUserUnit(this.app, unit)) {
                this._buildings.splice(this._buildings.indexOf(unit), 1);
                this.onChangeBuildings();
            }
        });
        this.app.map.units.on('add', unit => {
            if (unit.isType(UNIT_TYPES.VEHICLE.DEFAULT) && isUserUnit(this.app, unit)) {
                this._vehicles.push(unit);
                this.onChangeVehicles();
            }
        });
        this.app.map.units.on('remove', unit => {
            if (unit.isType(UNIT_TYPES.VEHICLE.DEFAULT) && isUserUnit(this.app, unit)) {
                this._vehicles.splice(this._vehicles.indexOf(unit), 1);
                this.onChangeVehicles();
            }
        });

        // Storages

        this._storages = this.getStorages().forEach(unit => unit.module.on('storage.value.add', this.onChangeResources, this));
        this.app.map.units.on('add', unit => {
            if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && isUserUnit(this.app, unit)) {
                unit.module.on('storage.value.add', this.onChangeResources, this);
                this._storages.push(unit);
            }
        });
        this.app.map.units.on('remove', unit => {
            if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && isUserUnit(this.app, unit)) {
                this._storages.splice(this._storages.indexOf(unit), 1);
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
        const transporters = this.vehicles.filter(unit => unit.isType(UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT));
        if (transporters.length > 0) {
            return transporters.shift();
        }
    }

    // Properties

    get resources() {
        return Object.assign({}, this._resources);
    }
    get buildings() {
        return [].concat(this._buildings);
    }
    get vehicles() {
        return [].concat(this._vehicles);
    }

    // Events

    onChangeBuildings() {
        this.trigger('change.buildings', this.buildings);
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
    }

}

function isUserUnit(app, unit) {
    if (app.user.is(unit.user)) {
        return true;
    }
}
