'use strict';

import {
    TRANSFER_DIRECTIONS,
    ACTIONS as ACTION_TYPES
} from '../../types';

import Action from '../Action';

import {
    ticker
} from '../Ticker';

ACTION_TYPES.TRANSFER = 'transfer';

export default class Transfer extends Action {
    constructor(unit, callback) {
        super(ACTION_TYPES.TRANSFER, unit, callback);
        this._timerListener = null;
        this._lastTickValue = 0;
        this._transferedValue = 0;
        this._targetUnit = null;
        this._transferType = null;
        this._transferMaxValue = null;
    }

    onComplete() {
        reset(this);
        Action.prototype.onComplete.apply(this, arguments);
    }

    onStop() {
        reset(this);
        Action.prototype.onStop.apply(this, arguments);
    }

    /*
     * Functions
     */

    start(targetUnit, type, value, direction) {
        if (targetUnit.module.isItemStorageEmpty() && direction) {
            // target empty?
            return false;
        } else if (this.unit.module.isItemStorageEmpty() && !direction) {
            // unit empty
            return false;
        } else if (direction && targetUnit.module.isTransferDirection( direction ? TRANSFER_DIRECTIONS.IN : TRANSFER_DIRECTIONS.OUT)) {
            // not allowed transfer direction
            return false;
        }

        this._transferDirection = direction || false;
        this._targetUnit = targetUnit;
        this._transferType = type;
        this._transferMaxValue = value;
        addListener(this);
        Action.prototype.start.apply(this, arguments);
    }

    destroy() {
        removeListener(this);
        Action.prototype.destroy.apply(this, arguments);
    }

    /*
     * Properties
     */

    get transferDirection() {
        return this._transferDirection;
    }
    get transferType() {
        return this._transferType;
    }

    /**
     * Gibt die Menge relativ zur Abbau Dauer an.
     * @type {Number}
     */
    get transferValue() {
        return 10;
    }

    /**
     * Gibt die effizents des Abbaues an. (VALUE * EFFICIENCY)
     * @type {Number}
     */
    get transferEfficiency() {
        return 1;
    }

    /**
     * Gibt die Abbau dauer an.
     * @type {Number}
     */
    get duration() {
        return 1000;
    }

}

/*
 * Functions
 */

function addListener(action) {
    action._timerListener = ticker.register(onTick.bind(action)(), onComplete.bind(action)(), action.duration);
}

function removeListener(action) {
    if (action._timerListener) {
        ticker.unregister(action._timerListener);
    }
    action._timerListener = null;
}

function reset(action) {
    removeListener(action);
    action._transferedValue = null;
}

// Events

function onTick() {
    return value => {
        this.trigger('transferring', this, value);
    };
}

function onComplete() {
    return () => {
        const val = this.unit.module.itemStorageTransfer(this._targetUnit.module, this._transferType, (this.transferValue * this.transferEfficiency), this._transferDirection);
        this._transferedValue += val;
        if (this.stopped) {
            this.onStop();
            return false;
        } else if ((!this._transferMaxValue || this._transferMaxValue && (this._transferedValue >= this._transferMaxValue || (this._transferDirection ? this._targetUnit.module : this.unit.module).isItemStorageEmpty() || (!this._transferDirection ? this._targetUnit.module : this.unit.module).isItemStorageFull()))) {
            this.onComplete();
            return false;
        } else {
            return true;
        }
    };
}
