'use strict';

import Vehicle from '../Vehicle';
import ItemStorage from '../abstract/ItemStorage';

export default class Transporter extends ItemStorage(Vehicle) {

    constructor(app, unit) {
        super(app, unit);
        this.maxItemStorageItemValue = 50;
    }

}
