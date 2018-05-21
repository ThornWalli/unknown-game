'use strict';

import Unit from '../Unit';
import Abstract_ItemStorage from './abstract/ItemStorage';
import Abstract_Consumption from './abstract/Consumption';

export default class Greenhouse extends Abstract_Consumption(Abstract_ItemStorage(Unit)) {
    constructor(app, unit) {
        super(app, unit);
    }
}
