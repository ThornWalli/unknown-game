'use strict';

import Unit from '../Unit';
import Abstract_ItemStorage from './abstract/ItemStorage';
import Abstract_ItemProduction from './abstract/ItemProduction';
import Abstract_Consumption from './abstract/Consumption';

const Extends = Abstract_Consumption(Abstract_ItemProduction(Abstract_ItemStorage(Unit)));
export default class Greenhouse extends Extends {
    constructor(app, unit) {
        super(app, unit);
    }

    destroy() {
        return this.cleanStorage().then(() => {
            return Extends.prototype.destroy.apply(this, arguments);
        });
    }

}
