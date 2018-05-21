'use strict';

import {
    UNITS as UNIT_TYPES,
    TRANSFER_DIRECTIONS
} from '../../../types';

import SyncPromise from 'sync-p';

/**
 * Abstract Class Module
 * @class ItemStorage
 */
export default Abstract => class extends Abstract {

    constructor(app, unit) {
        super(app, unit);
        /**
         * @type {Object}
         */
        this._itemStorageItems = {};
        /**
         * @type {Number}
         */
        this._maxItemStorageItemValue = 0;

        /**
         * @type {Array<game.types.items>}
         */
        this._allowedItemsStorageItems = [];

        this._itemsRequested = false;
        this._transporterRequested = false;

        this._transferDirection = TRANSFER_DIRECTIONS.BOTH;

    }

    /*
     * Functions
     */



    /**
     * Fordert die angegebene Resource an.
     * @param  {game.types.Items} type
     */
    requestItem(type, value) {

        if ( !this.isItemStorageFull()) {
            // this._itemsRequested = true;
            console.log('requestItem', type, value);
            return this.app.runtimeObserver.requestTransporters().then(transporters => {
                const transporter = transporters.shift();
                console.log('requestItem', transporter, this.unit, type, value);
                return transporter.module.bringItemFromStorage(this.unit, type, value);
            }).then(() => {
                // this._itemsRequested = false;
            }).catch(err => {
                throw err;
            });
        }
    }

    requestTransporterToEmpty(item) {
        if (!this._transporterRequested) {
            this._transporterRequested = true;
            // const key = item || Object.keys(this.itemStorageItems)[0];

            let items = [];
            if (item) {
                items.push(item);
            } else {
                items = items.concat(Object.keys(this.itemStorageItems));
            }
            const result = [];
            for (var i = 0; i < items.length; i++) {
                const transporter = this.app.runtimeObserver.requestTransporter();
                if (transporter) {
                    result.push(transporter.module.cleanStorage(this.unit, items[i]));
                } else {
                    break;
                }
            }

            return Promise.all(result).then(() => {
                return this.requestTransporterToEmpty(item);
            }).then(() => {
                console.log('SCHON FERTIG?');
                this._transporterRequested = false;
            });
        }

        return SyncPromise.resolve();
    }

    /**
     * Gibt an ob für das anegeben Item noch Platz ist.
     * @param  {game.types.items} type
     * @return {Boolean}
     */
    isFreeAndAllowedItem(type) {
        return !this.isItemStorageFull(type) && this.isItemAllowed(type);
    }

    /**
     * Ruft ab, ob das angegebene Item erlaubt ist.
     * @param  {game.types.items}  type [description]
     * @return {Boolean}      [description]
     */
    isItemAllowed(type) {
        return this._allowedItemsStorageItems.length === 0 || this._allowedItemsStorageItems.indexOf(type) !== -1;
    }

    /**
     * Überprüft ob der angegebene Typ vorhanden ist.
     * @param  {game.types.items} type
     * @return {Boolean}
     */
    hasItem(type) {
        if (/\.default$/.test(type) && !(type in this._itemStorageItems)) {
            type = type.replace(/\.default$/, '');
            return Object.keys(this._itemStorageItems).find(key => key.indexOf(type) === 0);
        }
        return type in this._itemStorageItems;
    }

    isTransferDirection(transferDirection) {
        if (this._transferDirection === TRANSFER_DIRECTIONS.BOTH) {
            if (transferDirection === TRANSFER_DIRECTIONS.IN || transferDirection === TRANSFER_DIRECTIONS.OUT) {
                return true;
            }
        } else if (
            this._transferDirection === TRANSFER_DIRECTIONS.OUT && transferDirection === TRANSFER_DIRECTIONS.IN || this._transferDirection === TRANSFER_DIRECTIONS.IN && transferDirection === TRANSFER_DIRECTIONS.OUT
        ) {
            return true;
        }
        return false;
    }

    /**
     * Überträgt Inhalt zum angegebenen Modul.
     * Gibt zurück wieviel Inhalt verschoben wurden ist.
     * @param  {Module} target
     * @param  {String} type
     * @param  {Number} value
     * @return {Number}
     */
    itemStorageTransfer(target, type, value, direction) {

        let from, to;
        if (direction) {
            // from -> to
            from = target;
            to = this;
        } else {
            // to -> from
            from = this;
            to = target;
        }

        if (!(type in from.itemStorageItems)) {
            return false;
        }

        value = Math.abs(value);
        value = Math.min(value, from.getItemStorageItemValue(type));

        // Nur das was auch vorhanden ist.
        const transferedValue = to.addItemStorageItemValue(type, value);

        if (transferedValue === false) {
            // Transfer konnte nicht ausgeführt werden.
            // - Kann am wechsel von erlaubten Items wärend des Transfers eintreten
            return false;
        }

        from.removeItemStorageItemValue(type, transferedValue);

        from.trigger('storage.value.transfer', from, type, value);
        to.trigger('storage.value.transfer', to, type, value);
        return transferedValue;
    }

    /**
     * Fügt dem angegebenen Typ, Inhalt hinzu.
     * Gibt den wirklich hinzugefügten Inhalt zurück.
     * @param {game.types.items} type  [description]
     * @param {game.types.items} value [description]
     */
    addItemStorageItemValue(type, value) {
        if (!checkMaxTypes(this, type)) {
            return false;
        }
        value = Math.abs(value);
        if (!this.isItemStorageFull()) {
            value = Math.min(value, this.getFreeItemStorageValue());
        } else {
            value = 0;
        }
        this._itemStorageItems[type] = (this._itemStorageItems[type] || 0) + value;
        this.trigger('storage.value.add', this, type, value);
        return value;
    }

    /**
     * Entfernt dem angegebenen Typ, den angegebenen Inhalt.
     * Gibt den wirklich entfernter Inhalt zurück.
     * @param {game.types.items} type  [description]
     * @param {game.types.items} value [description]
     */
    removeItemStorageItemValue(type, value) {
        value = Math.abs(value);
        this._itemStorageItems[type] = (this._itemStorageItems[type] || 0) - value;
        if (this._itemStorageItems[type] === 0) {
            delete this._itemStorageItems[type];
        }
        this.trigger('storage.value.remove', this, type, value);
        return value;
    }

    /**
     * Ruft ab kein Volumen vorhanden ist.
     * @param  {game.types.items} type (Optional)
     * @return {Boolean}
     */
    isItemStorageEmpty(type) {
        return type && this.getItemStorageItemValue(type) === 0 || !type && this.totalItemStorageValue === 0;
    }

    /**
     * Ruft ab ob maximal Volumen erreicht wurde.
     * @return {Boolean}
     */
    isItemStorageFull() {
        return this._maxItemStorageItemValue === this.totalItemStorageValue;
    }

    /**
     * Ruft zum angegebenen Item das Volumen ab.
     * @param  {game.types.items} type
     * @return {Number}
     */
    getItemStorageItemValue(type) {
        if (type in this._itemStorageItems) {
            return this._itemStorageItems[type];
        } else {
            return 0;
        }
    }

    /**
     * Ruft das freie Volumen ab.
     * @return {Number}
     */
    getFreeItemStorageValue() {
        return this._maxItemStorageItemValue - this.totalItemStorageValue;
    }

    /**
     * Ruft das nächste Item aus dem Storage ab.
     * @param {game.base.Unit} unit
     * @return {game.types.item}
     */
    getItemStorageAvailableItems(allowedItems = []) {
        return Object.keys(this.itemStorageItems).map(item => {
            if (allowedItems.length === 0 || allowedItems.indexOf(item) > -1) {
                return item;
            }
        });
    }


    /*
     * Properties
     */



    /**
     * Ruft die Transferausrichtung ab.
     * @return {Number}
     */
    get transferDirection() {
        return this._transferDirection;
    }
    /**
     * Legt die Transferausrichtung fest.
     * @param {Number} value
     */
    set transferDirection(value) {
        this._transferDirection = value;
    }

    /**
     * Ruft das maximal Volumen ab.
     * @return {Number}
     */
    get maxItemStorageItemValue() {
        return this._maxItemStorageItemValue;
    }
    /**
     * Legt das maximal Volumen fest.
     * @param {Number} value
     */
    set maxItemStorageItemValue(value) {
        this._maxItemStorageItemValue = value;
    }
    /**
     * Ruft das gesamt Volumen ab.
     * @return {Number}
     */
    get totalItemStorageValue() {
        return Object.values(this._itemStorageItems).reduce((result, value) => result + value, 0);
    }

    get itemStorageItems() {
        return this._itemStorageItems;
    }
    /**
     * Ruft die erlaubten Items ab.
     * @return {Array<game.types.items>}
     */
    get allowedItemsStorageItems() {
        return this._allowedItemsStorageItems;
    }
    /**
     * Setzt die erlaubten Items fest.
     * @type {Array<game.types.items>}
     */
    set allowedItemsStorageItems(value) {
        this._allowedItemsStorageItems = value;
        this.trigger('change.allowedItemsStorageItems', this._allowedItemsStorageItems, this);
    }
};

function checkMaxTypes(storage, type) {
    if (storage.allowedItemsStorageItems.length < 1 || storage.allowedItemsStorageItems.indexOf(type) > -1) {
        return true;
    } else {
        return false;
    }
}
