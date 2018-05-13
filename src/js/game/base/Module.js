'use strict';

import Events from './Events';
import lang from '../utils/lang';

export default class Module extends Events {
    constructor(app, unit) {
        super();
        this._app = app;
        this._unit = unit;
    }

    /*
 * Functions
 */

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
}
