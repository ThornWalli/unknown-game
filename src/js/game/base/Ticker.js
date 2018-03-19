'use strict';

import Events from './Events';
import Collection from './Collection';
import {
    clamp
} from '../../utils/math';
import {
    ticker as pixi_ticker
} from 'pixi.js';

const DEFAULT_DURATION = 1000;

class Ticker extends Events {
    constructor(name) {
        super();
        this._name = name;

        this._listeners = new Collection();
        this._listenerByDurations = new Map();

        this._ticker = new pixi_ticker.Ticker();
        this._ticker.autoStart = false;
        this._ticker.speed = 1; // 1 x 60fps

        this._now = null;


        // Virtual Time
        this._startTimestamp = Date.now();
        this._timestamp = this._startTimestamp;

        console.log('TICKER START', this);
    }
    now() {
        return ((this._now || Date.now()) - this._timestamp);
    }

    /*
 * Functions
 */

    start() {
        this._ticker.start();
    }
    stop() {
        this._ticker.stop();
    }

    skip(milliseconds) {
        console.log('Skip ms', milliseconds);
        this._ticker.stop();
        let now = Date.now();
        for (var i = 0; i <= milliseconds; i += 10) {
            this._now = now + i;
            this._ticker.update(this._now);
        }
        this._now = null;
        // reset listeners timestamp
        now = this.now();
        this._listeners.forEach(listener => listener.timestamp = now);

        this._timestamp -= milliseconds;
        this._ticker.start();
    }

    setTimeout(func, duration) {
        this.register(null, func, duration, true);
    }

    register(func, complete, duration = DEFAULT_DURATION, once = false) {
        const listener = new Listener(func, complete, duration, once);
        this._listeners.add(listener);
        addListenerToTicker(this, listener);
    }


    unregister(listener) {
        this._ticker.remove(listener.onTick, listener);
        this._listeners.remove(listener);
    }

    /*
 * Properties
 */

    get ticker() {
        return this._ticker;
    }
}

function addListenerToTicker(ticker, listener) {
    listener.ticker = ticker;
}

class Listener {
    constructor(tick, complete, duration, once) {
        this.tick = tick;
        this.complete = complete;
        this.duration = duration;
        this.once = once;
        this.timestamp = null;
    }
    onTick() {
        const now = this._ticker.now();
        if (this.tick) {
            this.tick(clamp((now - this.timestamp) / this.duration, 0, 1), this);
        }
        if ((now - this.timestamp) > this.duration) {
            if (this.complete) {
                if (this.complete(this)) {
                    if (this.once) {
                        this.remove();
                    } else {
                        this.timestamp = now;
                    }
                } else {
                    this.remove();
                }
            }
        }
    }

    /*
 * Functions
 */

    remove() {
        this._ticker.unregister(this);
    }

    /*
 * Properties
 */

    get ticker() {
        return this._ticker;
    }

    set ticker(ticker) {
        this._ticker = ticker;
        this.timestamp = this._ticker.now();
        this._ticker.ticker.add(this.onTick, this);
    }
}


const ticker = new Ticker();
ticker.start();

export {
    Ticker as
    default, ticker
};
