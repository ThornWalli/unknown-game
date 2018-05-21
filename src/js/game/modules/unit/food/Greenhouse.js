'use strict';

import {
    ITEMS
} from '../../../types';
import Food from '../Food';
import {
    ticker
} from '../../../base/Ticker';

const TYPE = ITEMS.FOOD.VEGETABLE;
const CONSUMPTION_TYPE_WATER = ITEMS.RESOURCE.WATER;

import {
    Consumption
} from '../abstract/Consumption';

export default class Greenhouse extends Food {
    constructor(app, unit) {
        super(app, unit);

        console.log('Start Date', Date.now());

        this.consumptions.add(new Consumption(CONSUMPTION_TYPE_WATER, 100, 10));

        this.maxItemStorageItemValue = 100;
        this.allowedItemsStorageItems.push(ITEMS.RESOURCE.WATER);
        this.allowedItemsStorageItems.push(TYPE);
        this.addItemStorageItemValue(TYPE, 20);



        ticker.register(null, this.onTickerComplete.bind(this), 60 * 2 * 1000);

        // setTimeout(() => {
        //     this.requestItem(ITEMS.RESOURCE.WATER, 50);
        // }, 5000);


        // this.getStorageWithResource

    }

    requiredItems(items) {
        items.forEach(item => this.requestItem(item.type, item.maxCapacity));

    }

    onTickerComplete() {
        if (!this.isItemStorageFull() && this.runConsumption()) {
            if (this.addItemStorageItemValue(TYPE, 10) !== 0) {
                this.log('Food created');
            } else {
                this.requestTransporterToEmpty();
            }
        } else {
            this.requestTransporterToEmpty();
        }
    }

}
