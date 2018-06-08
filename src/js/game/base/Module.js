'use strict';

import Events from './Events';
import lang from '../utils/lang';

import SyncPromise from 'sync-p';

export default class Module extends Events {
    constructor(app, unit) {
        super();
        this._app = app;
        this._unit = unit;

        this._exportableProperties = new Set();
    }

    destroy() {
        return SyncPromise.resolve();
    }

    /*
     * Functions
     */

    onReady() {}

    exportData() {

    }

    log(text) {
        this._app.logger.log(lang.get(this.unit.type), text);
    }

    /*
     * Properties
     */

    get app() {
        return this._app;
    }
    get unit() {
        return this._unit;
    }
    get ready() {
        return this._ready;
    }

    get exportableProperties() {
        return this._exportableProperties;
    }
}
