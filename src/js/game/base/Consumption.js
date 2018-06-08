'use strict';

import Events from './Events';

export default class Consumption extends Events {
    constructor(type, maxCapacity, value, {
        warningMinValues = 2
    }) {
        super();
        this.type = type;
        /**
         * Gibt die mindestmenge an Verbrauchen an, bevor Warnung eintritt.
         * @type {Number}
         */
        this.warningMinValues = warningMinValues;
        this._capacity = 0;
        this.maxCapacity = maxCapacity;
        this.value = value;
    }
    getCapacity() {
        return this.capacity / this.maxCapacity;
    }

    get capacity() {
        return this._capacity;
    }
    set capacity(value) {
        this._capacity = Math.min(Math.max(value, 0), this.maxCapacity);
        this.trigger('change.capacity', this);
        this.check();
    }

    check() {
        if (this.isEmpty()) {
            this.trigger('empty', this);
            return false;
        } else if (this.isWarning()) {
            this.trigger('warning', this);
        }
        return true;
    }

    isEmpty() {
        return this.capacity === 0;
    }

    isWarning() {
        return (this.capacity / this.value) < this.warningMinValues;
    }
}
