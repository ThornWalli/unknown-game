'use strict';

import Unit from '../Unit';
import ItemStorage from './abstract/ItemStorage';
// import Grabber from '../../base/unit/vehicle/harvester/Grabber';
// import Transporter from '../../base/unit/vehicle/Transporter';

const Extends = ItemStorage(Unit);
export default class Storage extends Extends {
    constructor(app, unit) {
        super(app, unit);

        // Stored units
        // this.createVehicleUnit(new Transporter());
        // this.createVehicleUnit(new Grabber());

        // this.app.unitSelect.selectUnit(harvesterUnit);
        this.on('change.allowedItemsStorageItems', onChangeAllowedItemsStorageItems, this);
    }

    destroy() {
        return this.cleanStorage().then(() => {
            return Extends.prototype.destroy.apply(this, arguments);
        });
    }

    createVehicleUnit(unit) {
        unit.user = this.unit.user;
        unit.position.setLocal(this.app.map.getPositionAroundPosition(this.unit.position));
        unit.on('module.ready', onVehiclerModuleReady, this);
        this.app.map.units.add(unit);
    }
}


function onChangeAllowedItemsStorageItems(allowedItemsStorageItems) {
    Object.keys(this.itemStorageItems).forEach(key => {
        if (allowedItemsStorageItems.indexOf(key) === -1) {
            this.cleanStorage(key);
        }
    });
}

function onVehiclerModuleReady(module) {
    this.log('Harvester created');
    module.transporterPreferredStorageUnit = this.unit;
    module.start();
}
