'use strict';

import {
    js as easystarjs
} from 'easystarjs';

import Position from './base/Position';
import SyncPromise from 'sync-p';

import {
    GRID_CELL_TYPES
} from './utils/matrix';

class Matrix {
    constructor(size, invert) {
        this._size = size;
        this.reset(size, invert);
    }

    reset(size, invert = false) {
        this._grid = Array(size.height);
        const value = invert ? 1 : 0;
        for (var i = 0; i < this._grid.length; i++) {
            this._grid[i] = Array(size.width).fill(value);
        }
        this._pathfinder = new easystarjs();
        this._pathfinder.enableSync();
        this._pathfinder.setAcceptableTiles([GRID_CELL_TYPES.DEFAULT, GRID_CELL_TYPES.ROAD]);
        this._pathfinder.setTileCost(GRID_CELL_TYPES.DEFAULT, 99999999999);
        this._pathfinder.setTileCost(GRID_CELL_TYPES.ROAD, 0);

        this._offset = new Position();
    }

    /*
     * Functions
     */

    getPath(start, dest) {
        return new SyncPromise(resolve => {
            this._pathfinder.setGrid(this._grid);
            this._pathfinderId = this._pathfinder.findPath(start.x, start.y, dest.x, dest.y, path => {
                this._pathfinder.cancelPath(this._pathfinderId);
                resolve(path);
            });
            this._pathfinder.calculate();
        });
    }

    // getCell(x, y) {
    //     return this._data.nodes[this.offset.x + x][this.offset.y + y];
    // }

    updateCell(x, y, type) {
        if (type === undefined) {
            throw new Error('Argument walkable must be set');
        }
        this._grid[y][x] = type;
    }

    /*
     * Properties
     */


    get data() {
        return this._data;
    }

    get offset() {
        return this._offset;
    }

    get size() {
        return this._size;
    }



}


export {
    GRID_CELL_TYPES,
    Matrix as
    default
};
