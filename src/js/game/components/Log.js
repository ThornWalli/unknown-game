'use strict';


export default class Log {
    constructor(app) {
        this._app = app;
    }
    getUnitActions() {
        return this._app.unitActions;
    }
}
