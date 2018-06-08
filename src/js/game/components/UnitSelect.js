'use strict';

export default class UnitSelect {
    constructor(app) {
        this._app = app;
    }

    setUnitType(unitType) {
        this._app.unitSelect.selectedUnitType = unitType;
    }

    /**
     * @param {boolean} value
     */
    removeSelectedUnits() {
        this._app.unitSelect.removeSelectedUnits(true);
    }
    isRemoveUnit() {
        return this._app.unitSelect.unitRemove;
    }

}
