'use strict';

import SyncPromise from 'sync-p';

import Unit from '../Unit';
import UnitStorage from './abstract/UnitStorage';

const Extends = UnitStorage(Unit);
export default class Depot extends Extends {
    constructor(app, unit) {
        super(app, unit);


    }

    destroy() {
        return SyncPromise.all(this.unitStorageUnits.map(unit => unit.module.unpark().then(() => {
            return unit.module.park();
        }))).then(() => {
            return Extends.prototype.destroy.apply(this, arguments);
        });
    }
}
