'use strict';

/**
 * Abstract Class Module
 * @class Storage
 */
export default Abstract => class extends Abstract {

    constructor(app, unit) {
        super(app, unit);
        /**
         * Aktuelles Volumen.
         * @type {Object}
         */
        this._storageValues = {};
        /**
         * Maximal Volumen.
         * @type {Number}
         */
        this._maxStorageValue = 0;
        /**
         * Maximal Anzahl an Inhalten.
         * @type {Number}
         */
        this._maxStorageValues = 0;
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
        value = Math.min(value, from.getStorageValue(type));

        // Nur das was auch vorhanden ist.
        const transferedValue = to.addStorageValue(type, value);
        console.log('transferedValue?',transferedValue);
        from.removeStorageValue(type, transferedValue);
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
    addStorageValue(type, value) {
        // console.log('addStorageValue pre', value, this.isStorageFull(), this.getFreeStorageValue());
        if (!checkMaxTypes(this, type)) {
            return false;
        }
        value = Math.abs(value);
        if (!this.isStorageFull()) {
            value = Math.min(value, this.getFreeStorageValue());
        } else {
            value = 0;
        }
        this._storageValues[type] = (this._storageValues[type] || 0) + value;
        this.trigger('storage.value.add', this, type, value);
        return value;
    }

    /**
     * Entfernt dem angegebenen Typ, den angegebenen Inhalt.
     * Gibt den wirklich entfernter Inhalt zurück.
     * @param {[type]} type  [description]
     * @param {[type]} value [description]
     */
    removeStorageValue(type, value) {
        value = Math.abs(value);
        if (this._storageValues[type] <= value) {
            delete this._storageValues[type];
        } else {
            this._storageValues[type] = (this._storageValues[type] || 0) - value;
        }
        this.trigger('storage.value.remove', this, type, value);
        return value;
    }

    isStorageEmpty(type) {
        return type && this.getStorageValue(type) === 0 || !type && this.totalStorageValue === 0;
    }

    isStorageFull() {
        return this._maxStorageValue === this.totalStorageValue;
    }

    getStorageValue(type) {
        if (type in this._storageValues) {
            return this._storageValues[type];
        } else {
            return 0;
        }
    }

    /**
     * Ruft das freie Volumen ab.
     * @return {Number}
     */
    getFreeStorageValue() {
        return this._maxStorageValue - this.totalStorageValue;
    }



    // Properties

    get totalStorageValue() {
        return Object.values(this._storageValues).reduce((result, value) => result + value, 0);
    }

    get storageValues() {
        return this._storageValues;
    }
    /**
     * Ruft das maximale Volumen ab.
     * @return {Number}
     */
    get maxStorageTotalValue() {
        return this._maxStorageValue;
    }
    /**
     * Ruft die maximale Anzahl an Inhalten ab.
     * @return {Number}
     */
    get maxStorageValues() {
        return this._maxStorageValues;
    }

};

function checkMaxTypes(storage, type) {
    const types = Object.keys(storage._storageValues);
    if (storage._maxStorageValues === 0) {
        return true;
    } else if (types.indexOf(type) > -1) {
        return true;
    } else if (storage._maxStorageValues > 0 && storage._maxStorageValues > types.length) {
        return true;
    } else {
        return false;
    }
}
