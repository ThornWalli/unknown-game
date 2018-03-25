'use strict';

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
        this._allowedItemStorageItems = [];
    }

    /*
     * Functions
     */

    /**
     * Überträgt Inhalt zum angegebenen Modul.
     * Gibt zurück wieviel Inhalt verschoben wurden ist.
     * @param  {Module} target
     * @param  {String} type
     * @param  {Number} value
     * @return {Number}
     */
    itemStorageTransfer(target, type, value, direction) {
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
        value = Math.min(value, from.getItemStorageItemValue(type));

        // Nur das was auch vorhanden ist.
        const transferedValue = to.addItemStorageItemValue(type, value);
        from.removeItemStorageItemValue(type, transferedValue);
        
        from.trigger('storage.value.transfer', from, type, value);
        to.trigger('storage.value.transfer', to, type, value);
        return transferedValue;
    }

    /**
     * Fügt dem angegebenen Typ, Inhalt hinzu.
     * Gibt den wirklich hinzugefügten Inhalt zurück.
     * @param {[type]} type  [description]
     * @param {[type]} value [description]
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
     * @param {[type]} type  [description]
     * @param {[type]} value [description]
     */
    removeItemStorageItemValue(type, value) {
        value = Math.abs(value);
        if (this._itemStorageItems[type] <= value) {
            delete this._itemStorageItems[type];
        } else {
            this._itemStorageItems[type] = (this._itemStorageItems[type] || 0) - value;
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
            if (!allowedItems.length || allowedItems.indexOf(item) > -1) {
                return item;
            }
        });
    }


    /*
     * Properties
     */

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
     * @type {Array<game.types.items>}
     */
    get allowedItemStorageItems() {
        return this._allowedItemStorageItems;
    }
};

function checkMaxTypes(storage, type) {
    if (storage.allowedItemStorageItems.length < 1 || storage.allowedItemStorageItems.indexOf(type) > -1) {
        return true;
    } else {
        return false;
    }
}
