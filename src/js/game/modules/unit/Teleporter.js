'use strict';

import Unit from '../Unit';

export default class Teleporter extends Unit {
    constructor(app, unit) {
        super(app, unit);
        this._teleporterRequestedItems = [];
    }

    get teleporterRequestedItems() {
        return this._teleporterRequestedItems;
    }

    set teleporterRequestedItems(value) {
        this._teleporterRequestedItems = value;
        this.trigger('change.teleporterRequestedItems', this, value);
    }
}
