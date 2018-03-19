'use strict';

import {
    ACTIONS as ACTION_TYPES
} from '../../types';

import Action from '../Action';

import {
    ticker
} from '../Ticker';

ACTION_TYPES.SPAWN = 'spawn';

export default class Spawn extends Action {
    constructor(unit, callback) {
        super(ACTION_TYPES.SPAWN, unit, callback);
        this._timerListener = null;
        this._duration = 1000;
    }

    onComplete() {
        removeListener(this);
        Action.prototype.onComplete.apply(this, arguments);
    }

    /*
     * Functions
     */

    start(duration) {
        this._duration = duration;
        addListener(this);
        Action.prototype.start.apply(this, arguments);
    }

    stop() {
        removeListener(this);
        Action.prototype.stop.apply(this, arguments);
    }

    destroy() {
        removeListener(this);
        Action.prototype.destroy.apply(this, arguments);
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
    action._timerListener = ticker.register(null, onComplete.bind(action), action.duration);
}

function removeListener(action) {
    if (action._timerListener) {
        ticker.unregister(action._timerListener);
    }
    action._timerListener = null;
}

// Events

function onComplete() {
    this.onComplete();
    return false;
}
