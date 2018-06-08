'use strict';

import {
    ITEMS
} from '../../../types';
import Food from '../Food';


const TYPE = ITEMS.ENERGY;
// import Consumption from '../../../base/Consumption';
// const CONSUMPTION_TYPE_WATER = ITEMS.RESOURCE.WATER;

export default class PowerGeneration extends Food {
    constructor(app, unit) {
        super(app, unit);
        //
        // this.consumptions.add(new Consumption(CONSUMPTION_TYPE_WATER, 100, 20, {
        //     warningMinValues: 3
        // }));

        this.productionItems.push(TYPE);
        this.maxItemStorageItemValue = 100;
        this.allowedItemsStorageItems.push(ITEMS.RESOURCE.WATER);
        this.allowedItemsStorageItems.push(TYPE);
        this.addItemStorageItemValue(TYPE, 20);



        // setTimeout(() => {
        //     this.requestItem(ITEMS.RESOURCE.WATER, 50);
        // }, 5000);


        // this.getStorageWithResource

    }

    onReady() {
        Food.prototype.onReady.apply(this, arguments);
        this.startItemProduction(true);
    }

    onEmptyConsumption(consumption) {
        return this.requestItem(consumption.type, consumption.maxCapacity - consumption.capacity);
    }

    onTickerComplete() {
        return Food.prototype.onTickerComplete.apply(this, arguments);
    }

}
