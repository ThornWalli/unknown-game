'use strict';

/**
 * Abstract Class Module
 * @class ItemStorage
 */
export default Abstract => class extends Abstract {

    constructor(app, unit) {
        super(app, unit);
        /**
         * Aktuelles Volumen.
         * @type {Object}
         */
        this._storageItems = {};
        /**
         * Maximal Volumen.
         * @type {Number}
         */
        this._maxItemStorageValue = 0;
        /**
         * Maximal Anzahl an Inhalten.
         * @type {Number}
         */
        this._maxItemStorageItems = 0;
    }

    // Functions

    /**
     * Überträgt Inhalt zum angegebenen Modul.
     * Gibt zurück wieviel Inhalt verschoben wurden ist.
     * @param  {Module} target
     * @param  {String} type
     * @param  {Number} value
     * @return {Number}
     */
    storageTransfer(target, type, value, direction) {

        value = Math.abs(value);

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
        value = Math.min(value, from.getStorageItemValue(type));

        // Nur das was auch vorhanden ist.
        const transferedValue = to.addStorageItemValue(type, value);
        from.removeStorageItemValue(type, transferedValue);
        console.log('TRANSFER', type, value, transferedValue);
        this.trigger('storage.value.transfer', this, type, value);
        return transferedValue;
    }

    /**
     * Fügt dem angegebenen Typ, Inhalt hinzu.
     * Gibt den wirklich hinzugefügten Inhalt zurück.
     * @param {[type]} type  [description]
     * @param {[type]} value [description]
     */
    addStorageItemValue(type, value) {
        // console.log('addStorageItemValue pre', value, this.isItemStorageFull(), this.getFreeStorageValue());
        if (!checkMaxTypes(this, type)) {
            return false;
        }
        value = Math.abs(value);
        if (!this.isItemStorageFull()) {
            value = Math.min(value, this.getFreeStorageValue());
        } else {
            value = 0;
        }
        this._storageItems[type] = (this._storageItems[type] || 0) + value;
        this.trigger('storage.value.add', this, type, value);
        return value;
    }

    /**
     * Entfernt dem angegebenen Typ, den angegebenen Inhalt.
     * Gibt den wirklich entfernter Inhalt zurück.
     * @param {[type]} type  [description]
     * @param {[type]} value [description]
     */
    removeStorageItemValue(type, value) {
        value = Math.abs(value);
        if (this._storageItems[type] <= value) {
            delete this._storageItems[type];
        } else {
            this._storageItems[type] = (this._storageItems[type] || 0) - value;
        }
        this.trigger('storage.value.remove', this, type, value);
        return value;
    }

    isItemStorageEmpty(type) {
        return type && this.getStorageItemValue(type) === 0 || !type && this.totalStorageValue === 0;
    }

    isItemStorageFull() {
        return this._maxItemStorageValue === this.totalStorageValue;
    }

    getStorageItemValue(type) {
        if (type in this._storageItems) {
            return this._storageItems[type];
        } else {
            return 0;
        }
    }

    /**
     * Ruft das freie Volumen ab.
     * @return {Number}
     */
    getFreeStorageValue() {
        return this._maxItemStorageValue - this.totalStorageValue;
    }



    // Properties

    get totalStorageValue() {
        return Object.values(this._storageItems).reduce((result, value) => result + value, 0);
    }

    get storageItems() {
        return this._storageItems;
    }
    /**
     * Ruft das maximale Volumen ab.
     * @return {Number}
     */
    get maxStorageTotalValue() {
        return this._maxItemStorageValue;
    }
    /**
     * Ruft die maximale Anzahl an Inhalten ab.
     * @return {Number}
     */
    get maxItemStorageItems() {
        return this._maxItemStorageItems;
    }

};

function checkMaxTypes(storage, type) {
    const types = Object.keys(storage._storageItems);
    if (storage._maxItemStorageItems === 0) {
        return true;
    } else if (types.indexOf(type) > -1) {
        return true;
    } else if (storage._maxItemStorageItems > 0 && storage._maxItemStorageItems > types.length) {
        return true;
    } else {
        return false;
    }
}
