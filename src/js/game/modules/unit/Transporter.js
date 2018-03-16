'use strict';

import Unit from '../Unit';
import ItemStorage from './abstract/ItemStorage';

export default class Transporter extends ItemStorage(Unit) {

    constructor(app, unit) {
        super(app, unit);
        this._maxStorageValue = 50;
    }

}
