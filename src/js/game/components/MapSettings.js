'use strict';

import Size from '../base/Size';
import {
    UNIT_CLASSES
} from '../types';
import {
    getDefaultMapData
} from '../MapLoader';



export default class MapSettings {
    constructor(app) {
        this._app = app;
    }

    getMatrixSize() {
        return this._app.map.matrix.size;
    }
    setMatrixSize(size) {
        this._app.map.reset(size);
        this._app.display.reset();
    }

    import (data) {
        data = getDefaultMapData(data);
        this._app.map.reset(new Size(data.matrix));
        data.units.forEach(unitData => {
            const unit = new UNIT_CLASSES[unitData.type]();
            unit.position.setLocal(unitData.position);
            this._app.map.units.add(unit);
        });
        this._app.display.reset();
    }
    export () {
        return getDefaultMapData({
            matrix: this._app.map.matrix.size.toJSON(),
            units: this._app.map.units.map(unit => {
                const data = {
                    active: unit.active,
                    type: unit.type,
                    position: unit.position.toJSON()
                };
                if (unit.user) {
                    data.user = unit.user.id;
                }

                return data;
            })
        });
    }


}
