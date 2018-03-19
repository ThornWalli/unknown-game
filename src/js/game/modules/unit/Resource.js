'use strict';

import Unit from '../Unit';
import ItemStorage from './abstract/ItemStorage';

export default class Resource extends ItemStorage(Unit) {

    constructor(app, unit) {
        super(app, unit);
    }

    /*
     * Functions
     */

    removeItemStorageItemValue() {
        const removeItemStorageItemValue = ItemStorage(Unit).prototype.removeItemStorageItemValue.apply(this, arguments);
        if (this.isItemStorageEmpty()) {
            this.remove();
        }
        return removeItemStorageItemValue;
    }

    /**
     * Entfernt die Ressource.
     */
    remove() {
        this.unit.remove();
    }

}
