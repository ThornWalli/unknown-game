'use strict';


export default class UnitOverview {
    constructor(app) {
        this._app = app;
    }
    getUnitActions() {
        return this._app.unitActions;
    }
}
