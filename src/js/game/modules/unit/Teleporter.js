'use strict';

import {
    ITEMS_DATA_MAP,
    ACTIONS as ACTION_TYPES
} from '../../types';

import Unit from '../Unit';
import Abstract_ItemStorage from './abstract/ItemStorage';

import SyncPromise from 'sync-p';

const Extends = Abstract_ItemStorage(Unit);
export default class Teleporter extends Extends {
    constructor(app, unit) {
        super(app, unit);
        this._teleporterEnergy = 1;
        this._teleporterActiveRequest = null;
        this._teleporterRequestDurationTime = null;
        this._teleporterArrivalTime = null;
        this._teleporterItemSlots = 4;
        this._teleporterRequestedItems = [];
        this._teleporterAutoRequest = true;
    }

    destroy() {
        return this.cleanStorage().then(() => {
            return Extends.prototype.destroy.apply(this, arguments);
        });
    }

    onReady() {
        Extends.prototype.onReady.apply(this, arguments);
        console.log('öäääää');
        this
            .on('storage.value.empty', onItemStorageEmpty, this)
            .on('change.teleporterRequestedItems', onChangeRequestedItems);
        if (this.teleporterRequestedItems.length > 0) {
            onChangeRequestedItems(this, this.teleporterRequestedItems);
        }
    }

    /*
     * Functions
     */

    requestItems(items, random = Math.random) {

        if (this.isItemStorageFull()) {
            return this.requestTransporterToEmpty().then(() => {
                this._teleporterActiveRequest = null;
                if (this._teleporterRequestedItems && this._teleporterAutoRequest) {
                    return this.requestItems(this._teleporterRequestedItems, random);
                }
            });
        } else if (!this._teleporterActiveRequest) {
            const requestedItems = [];
            items = items.filter(item => {
                if (ITEMS_DATA_MAP[item].teleporterEnergy <= this._teleporterEnergy) {
                    return item;
                }
            });
            if (items.length < 1) {
                return this.requestItems(this._teleporterRequestedItems, random);
            }
            for (var i = 0; i < this._teleporterItemSlots; i++) {
                requestedItems.push(items[Math.round(random() * (items.length - 1))]);
            }
            console.log('JOOO');
            this._teleporterRequestDurationTime = this.getDurationFromItems();
            this._teleporterArrivalTime = Date.now() + this._teleporterRequestDurationTime;
            this.trigger('teleporter.request');
            this._teleporterActiveRequest = this.app.unitActions.add({
                type: ACTION_TYPES.WAIT,
                unit: this.unit,
                startArgs: [this._teleporterRequestDurationTime]
            }).then(() => {
                const count = {};
                const freeStorage = this.getFreeItemStorageValue();
                requestedItems.forEach(item => {
                    count[item] = (count[item] || 0) + 1;
                });
                return Object.keys(count).reduce((count, key) => {
                    count[key] = (count[key] / this._teleporterItemSlots) * freeStorage;
                    this.addItemStorageItemValue(key, count[key]);
                    return count;
                }, count);
            }).then(() => {
                this.trigger('teleporter.receive');
                return this.requestTransporterToEmpty().then(() => {
                    this._teleporterActiveRequest = null;
                    if (this._teleporterRequestedItems && this._teleporterAutoRequest) {
                        return this.requestItems(this._teleporterRequestedItems, random);
                    }
                });
            }).catch(e => {
                throw e;
            });
            return this._teleporterActiveRequest;
        }
        return SyncPromise.resolve();
    }

    getDurationFromItems() {
        return 1000 * 10;
    }

    /*
     * Properties
     */

    get teleporterRequestedItems() {
        return this._teleporterRequestedItems;
    }

    set teleporterRequestedItems(value) {
        this._teleporterRequestedItems = value;
        this.trigger('change.teleporterRequestedItems', this, value);
    }
}

function onItemStorageEmpty() {
    if (this._teleporterRequestedItems) {
        this.requestItems(this._teleporterRequestedItems);
    }
}

function onChangeRequestedItems(teleporter, requestedItems) {
    if (!teleporter._teleporterIsRequest) {
        teleporter.requestItems(requestedItems);
    }
}
