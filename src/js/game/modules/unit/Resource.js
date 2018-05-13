'use strict';

import {
    TRANSFER_DIRECTIONS
} from '../../types';

import Unit from '../Unit';
import ItemStorage from './abstract/ItemStorage';

export default class Resource extends ItemStorage(Unit) {

    constructor(app, unit) {
        super(app, unit);
        this.transferDirection = TRANSFER_DIRECTIONS.OUT;
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
