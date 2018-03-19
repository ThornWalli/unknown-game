'use strict';

// Import base-types
import Events from './base/Events';
import Size from './base/Size';
import Position from './base/Position';
import InputKeyEvent from './base/InputKeyEvent';
import InputPointerEvent from './base/InputPointerEvent';


import './bootloader';

import Map from './Map';

import Logger from './Logger';
import UnitSelect from './UnitSelect';
import UnitActions from './UnitActions';
// import BotControl from './BotControl';
import UnitModuleControl from './UnitModuleControl';

import Display from './Display';
import InputControl from './InputControl';

import {
    mapLoader,
    getDefaultMapData
} from './MapLoader';

import history from 'gp-module-history';

// Units




const DEFAULT_MAP_URI = 'external/maps/demo-1.json';

class App extends Events {
    constructor(containerEl, options) {
        super();

        /*
 * Properties
 */
        this._map = null;
        this._display = null;
        this._inputControl = null;
        this._ready = ready.bind(this)(containerEl, options);
    }

    /*
     * Functions
     */

    refresh() {
        this.trigger('refresh');
    }

    readMapData(data) {
        data = getDefaultMapData(data);
        this.map.reset(new Size(data.matrix), data.units);
        this.display.reset();
    }

    /*
     * Properties
     */

    get ready() {
        return this._ready;
    }
    get display() {
        return this._display;
    }
    get inputControl() {
        return this._inputControl;
    }
    get canvas() {
        return this._canvas;
    }
    get map() {
        return this._map;
    }
    get dimension() {
        return this._dimension;
    }
    get activeTest() {
        return this._activeTest;
    }
    get logger() {
        return this._logger;
    }
    get unitSelect() {
        return this._unitSelect;
    }
    get unitActions() {
        return this._unitActions;
    }
    get botControl() {
        return this._botControl;
    }

    /*
     * Events
     */

    // Pointer
    onPointerDown(event) {
        const offset = this.display.getOffset();
        event.position = new Position(event.x, event.y);
        event.matrixPosition = new Position(
            Math.floor((event.x + offset.x) / this.map.cellSize.width),
            Math.floor((event.y + offset.y) / this.map.cellSize.height)
        );
        return this._inputControl.pointerDown(event);
    }
    onPointerUp(event) {
        return this._inputControl.pointerUp(event);
    }
    onPointerMove(event) {
        return this._inputControl.pointerMove(event);
    }
    // Keyboard
    onKeyDown(event) {
        return this._inputControl.keyDown(event);
    }
    onKeyUp(event) {
        return this._inputControl.keyUp(event);
    }

}

function loadMap(uri) {

    if (uri) {
        return mapLoader.load(uri);
    } else {
        return Promise.resolve(getDefaultMapData());
    }
}

function ready(containerEl, options) {

    console.log('App Options:', options, this);
    global.app = this;
    this._inputControl = new InputControl(this);

    let mapUri = getGETParam('map-uri');
    if (options.test) {
        this._activeTest = new options.test(this);
        if (!mapUri) {
            options.size = this._activeTest.size || options.size;
        }
        options.visibleSize = this._activeTest.visibleSize || options.visibleSize;
        options.loadModules = !this._activeTest.loadModules;
        console.log('App Test', this._activeTest);
    } else {
        mapUri = mapUri || DEFAULT_MAP_URI;
    }

    return loadMap(mapUri).then(data => {
        if (options.size && options.size instanceof Size) {
            data.matrix = data.size || options.size;
        }
        this._map = new Map(data.matrix, data.units);
    }).then(() => {
        this._display = new Display(this, containerEl, options);
        this._display.reset();
        return this._display.ready;
    }).then(() => {
        this._logger = new Logger(this);
        if ('loadModules' in options && options.loadModules || !('loadModules' in options)) {
            setupUnitSelect(this);
            setupUnitActions(this);
            setupUnitModuleControl(this);
        }

        if (this._activeTest) {
            this._activeTest.start();
        }
        this.refresh();
        return this;
    }).catch(err => {
        console.error(err);
        throw err;
    });

}

function setupUnitSelect(app) {
    app._unitSelect = new UnitSelect(app);
    // Events
    app.inputControl.on('pointerdown', app._unitSelect.onPointerDown, app._unitSelect);
}

function setupUnitActions(app) {
    app._unitActions = new UnitActions(app);
}

function setupUnitModuleControl(app) {
    app._unitModuleControl = new UnitModuleControl(app);
}

function getGETParam(name) {
    if (history.registry.get(name)) {
        return history.registry.get(name).value;
    }
    return null;
}

// Export

export {
    App as
    default,
    App,
    Size,
    Position,
    InputKeyEvent,
    InputPointerEvent
};
