'use strict';

import LogCollection from './base/collection/Log';
import Log from './base/Log';

import {
    ticker as globalTicker
} from './base/Ticker';

/**
 * Verwaltet die Logs.
 */
export default class Logger {
    constructor(app, ticker = globalTicker) {
        this._ticker = ticker;
        this._app = app;
        this._logs = new LogCollection();
    }

    // Functions

    log(type, text) {
        this._logs.add(new Log(this._ticker.now(), type, text));
    }

    // Properties

    get logs() {
        return this._logs;
    }

}
