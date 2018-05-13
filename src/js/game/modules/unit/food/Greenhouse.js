'use strict';

import {
    ITEMS
} from '../../../types';
import Food from '../Food';
import {
    ticker
} from '../../../base/Ticker';

const TYPE = ITEMS.FOOD.DEFAULT;

export default class Greenhouse extends Food {
    constructor(app, unit) {
        super(app, unit);

        console.log('Start Date', Date.now());

        this.maxItemStorageItemValue = 100;
        this.allowedItemsStorageItems.push(TYPE);
        this.addItemStorageItemValue(TYPE, 20);

        this._transporterRequested = false;

        ticker.register(null, this.onTickerComplete.bind(this), 60 * 2 * 1000);

    }

    onTickerComplete() {
        if (!this.isItemStorageFull() && this.addItemStorageItemValue(TYPE, 10) !== 0) {
            this.log('Food created');
        }
        if (this.isItemStorageFull() && !this._transporterRequested) {
            this._transporterRequested = true;
            this.requestTransporter().then(() => {
                console.log('SHON FERTIG?');
                this._transporterRequested = false;
            });
        }
    }

}
