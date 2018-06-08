'use strict';

import {
    ACTIONS as ACTION_TYPES
} from '../../types';

import Action from '../Action';

import {
    ticker
} from '../Ticker';

ACTION_TYPES.WAIT = 'wait';

export default class Wait extends Action {
    constructor(unit, callback) {
        super(ACTION_TYPES.WAIT, unit, callback);
        this._timerListener = null;
    }

    onStop() {
        removeListener(this);
        Action.prototype.onStop.apply(this, arguments);
    }

    onComplete() {
        removeListener(this);
        Action.prototype.onComplete.apply(this, arguments);
    }

    /*
     * Functions
     */

    start(duration) {
        if (duration) {
            this._duration = duration;
            addListener(this);
            Action.prototype.start.apply(this, arguments);
        } else {
            Action.prototype.start.apply(this, arguments);
            this.onComplete();
        }
    }

    /*
     * Properties
     */

    get duration() {
        return this._duration;
    }
}

/*
 * Functions
 */

function addListener(action) {
    action._timerListener = ticker.register(onTick.bind(action), onComplete.bind(action), action.duration);
}

function removeListener(action) {
    if (action._timerListener) {
        ticker.unregister(action._timerListener);
    }
    action._timerListener = null;
}

// Events

function onTick(value) {
    if (this._stopped) {
        console.log('????');
        this.onStop();
        return false;
    }
    this.trigger('waiting', this, value);
}

function onComplete() {
    this.onComplete();
    return false;
}
