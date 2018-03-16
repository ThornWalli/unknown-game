'use strict';

import Events from './Events';

export default class Action extends Events {
    constructor(type, unit, callback) {
        super();
        this._unit = unit;
        this._callback = callback;
        this._type = type || 'default';

        this._started = false;
        this._stopped = false;
        this._completed = false;
    }

    // Functions

    onComplete() {
        this._completed = true;
        this._stopped = false;
        this._started = false;
        this.trigger('complete', this);
    }

    destroy() {
        this._unit = null;
        this.detacheEvents();
    }

    onStop() {
        this._stopped = true;
        this.trigger('stop', this);
    }

    /**
     * @override
     */
    start() {
        if (!this._stopped) {
            this.trigger('start', this);
        }
        this._stopped = false;
        this._started = true;
    }
    /**
     * @override
     */
    pause() {}
    /**
     * @override
     */
    stop() {
        this._started = false;
        this._stopped = true;
        this.trigger('stop', this);
    }
    /**
     * @override
     */
    set() {}

    toString() {
        return `Action: ${this.type}`;
    }

    // Properties

    /**
     * Duration (Milliseconds)
     * @override
     * @return {Number}
     */
    get duration() {
        return 0;
    }
    /**
     * @return {Function}
     */
    get callback() {
        return this._callback;
    }
    /**
     * @return {Unit}
     */
    get unit() {
        return this._unit;
    }
    /**
     * @return {String}
     */
    get type() {
        return this._type;
    }
    /**
     * @return {Boolean}
     */
    get started() {
        return this._started;
    }
    /**
     * @return {Boolean}
     */
    get stopped() {
        return this._stopped;
    }

}
