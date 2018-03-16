'use strict';

import Unit from '../Unit';
import ItemStorage from './abstract/ItemStorage';

export default class Resource extends ItemStorage(Unit) {

    constructor(app, unit) {
        super(app, unit);

        this._storageItems.iron = 10;
        this._maxItemStorageValue = 10;

    }

    // Functions

    removeStorageItemValue() {
        const removeStorageItemValue = ItemStorage(Unit).prototype.removeStorageItemValue.apply(this, arguments);
        if (this.isItemStorageEmpty()) {
            this.remove();
        }
        return removeStorageItemValue;
    }

    /**
     * Entfernt die Ressource.
     */
    remove() {
        this.unit.remove();
    }

}
