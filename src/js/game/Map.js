'use strict';

import Events from './base/Events';
import Position from './base/Position';
import Size from './base/Size';

import {
    getPositionsAroundPositionCircle
} from './utils/matrix';
import Units from './base/collection/Units';
import {
    default as Matrix
} from './Matrix';
import {
    GRID_CELL_TYPES
} from './utils/matrix';
// import {
//     clamp
// } from '../utils/math';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from './types';

export default class Map extends Events {
    constructor(size, units = []) {
        super();
        this._size = new Size();

        /**
         * TODO _cellSize
         * Hier vllt mal überlegen… müsste glaub weg und gehört zum RenderWrapper.
         * Wird benötigt für Selektieren im UnitSelect. Sollte der RenderWrapper über Intersect Click seöber machen.
         */
        this._cellSize = new Size(20, 20);

        this.setupUnits();

        if (size) {
            reset.bind(this)(size, units);
        }
    }

    /*
     * Functions
     */

    reset(size, units = []) {
        reset.bind(this)(size, units);
        this.trigger('reset');
    }

    refresh() {
        this.trigger('refresh');
    }

    /**
     * @param  {Number}  x
     * @param  {Number}  y
     * @return {GRID_CELL_TYPES}
     */
    isCellWalkable(x, y) {
        let walkable = true;
        if (x > 0 && y > 0 && x < this._size.x && y < this._size.y) {
            const units = this.getUnitsByCell(x, y);
            for (var i = 0; i < units.length; i++) {
                if (units[i].isType(UNIT_TYPES.ROAD.DEFAULT)) {
                    return GRID_CELL_TYPES.ROAD;
                } else
                if (walkable) {
                    walkable = units[i].walkable;
                }
            }
        } else {
            walkable = false;
        }
        return walkable ? GRID_CELL_TYPES.DEFAULT : GRID_CELL_TYPES.BLOCKED;
    }

    isCellRoad(x, y) {
        return this.getUnitsByCell(x, y).find(unit => {
            if (unit.type === UNIT_TYPES.ROAD.DEFAULT) {
                return true;
            }
        });
    }

    isCellFree(x, y) {
        return (this.getUnitByCell(x, y) || []).length === 0;
    }

    // clampPosition(position) {
    //     return position.setValuesLocal(clamp(position.x, 0, this.matrix.size.width), clamp(position.y, 0, this.matrix.size.height));
    // }

    getUnitById(id) {
        return this.units.find(unit => {
            if (unit.id === id) {
                return true;
            }
        });
    }

    getUnitByCell(x, y, type) {
        return this._units.find(unit => {
            if (unit.position.isValues(x, y) && (!type || unit.isType(type))) {
                return unit;
            }
        });
    }

    getUnitsByCell(x, y, type) {
        return this._units.reduce((result, unit) => {
            if (unit.position.isValues(x, y) && (!type || unit.isType(type))) {
                result.push(unit);
            }
            return result;
        }, []);
    }

    getUnitsByType(type) {
        return this._units.filter(unit => {
            if (unit.isType(type)) {
                return true;
            }
        });
    }

    getMoveData(unit, position, options = {}) {
        return findPath.bind(this)(unit, position, options).then(path => {
            return new MoveData(position, path);
        });
    }

    addNeighbor(x, y, unit) {

        if (!this._neighborMatrix[x]) {
            this._neighborMatrix[x] = {};
        }
        if (!this._neighborMatrix[x][y]) {
            this._neighborMatrix[x][y] = [];
        }
        this._neighborMatrix[x][y].push(unit);
    }

    removeNeighbor(x, y, unit) {
        if (this._neighborMatrix[x]) {
            this._neighborMatrix[x][y].splice(this._neighborMatrix[x][y].indexOf(unit), 1);
        }
    }

    refreshNeighbor(unit, type, deep = true) {
        const neighbors = [],
            neighborPositions = [];
        getPositionsAroundPositionCircle(unit.position, 1).forEach(position => {
            if (position) {
                if (this._neighborMatrix[position.x] && this._neighborMatrix[position.x][position.y]) {
                    const neighbor = this._neighborMatrix[position.x][position.y].find(neighbor => {
                        if (neighbor && neighbor.isType(type)) {
                            if (deep) {
                                this.refreshNeighbor(neighbor, type, false, [unit]);
                            }
                            return true;
                        }
                    });
                    if (neighbor) {
                        neighbors.push(neighbor);
                        neighborPositions.push([position.y - unit.position.y, position.x - unit.position.x]);
                    }
                }

            }
        });
        unit.neighbors = neighbors;
        unit.neighborPositions = neighborPositions;
    }

    // refreshNeighbors(unit, type, deep = true) {
    //     const neighbors = [];
    //     const neighborPositions = [];
    //     if (!type) {
    //         type = unit.type;
    //     }
    //     const unitPosition = unit.position;
    //
    //     getPositionsAroundPositionCircle(unitPosition, 1).forEach(position => {
    //         if (position) {
    //             if (this._neighborMatrix[position.x] && this._neighborMatrix[position.x][position.y]) {
    //                 const neighbor = this._neighborMatrix[position.x][position.y].find(neighbor => {
    //                     if (neighbor && neighbor.isType(type)) {
    //                         if (deep) {
    //                             this.refreshNeighbor(neighbor, type, false);
    //                         }
    //                         return true;
    //                     }
    //                 });
    //                 if (neighbor) {
    //                     neighbors.push(neighbor);
    //                     neighborPositions.push([position.y - unitPosition.y, position.x - unitPosition.x]);
    //                 }
    //             }
    //
    //         }
    //     });
    //     unit.neighbors = neighbors;
    //     unit.neighborPositions = neighborPositions;
    // }

    // refreshNeighbor(unit, x, y, type, deep = true) {
    //
    //     unit.neighbors = getPositionsAroundPositionCircle(new Position(x, y), 1).reduce((result, position) => {
    //
    //         if (position) {
    //             if (this._neighborMatrix[position.x] && this._neighborMatrix[position.x][position.y]) {
    //                 const unit = this._neighborMatrix[position.x][position.y].find(unit => {
    //                     if (unit && unit.isType(type)) {
    //                         if (deep) {
    //                             unit.neighbors = this.refreshNeighbor(position.x, position.y, type, false);
    //                         }
    //                         return true;
    //                     }
    //                 });
    //                 if (unit) {
    //                     result.push(unit);
    //                         // result.push([position.y - y, position.x - x]);
    //                 }
    //             }
    //
    //         }
    //         return result;
    //     }, []);
    // }

    /**
     * Gibt die nächste freie Position an. (Radial)
     * @param  {Position} position
     * @param  {Number} radius
     * @return {Position}
     */
    getPositionAroundPosition(position, radius = 1) {
        if (radius > 99999999) {
            return false;
        }
        const positions = getPositionsAroundPositionCircle(position, radius);
        for (var i = 0; i < positions.length; i++) {
            if (this.isCellWalkable(positions[i].x, positions[i].y) !== GRID_CELL_TYPES.BLOCKED) {
                return position.setValues(positions[i].x, positions[i].y);
            }
        }
        const result = this.getPositionAroundPosition(position, radius + 1);
        if (!result) {
            return null;
        }
        return result;
    }


    setupUnits() {
        this._units = new Units();
        this.addEventsForwarding('units', this._units);
        this.on('units.add', onAddRemoveUnit, this)
            .on('units.remove', onAddRemoveUnit, this)
            .on('units.add', onAddUnit, this)
            .on('units.remove', onRemoveUnit, this)
            .on('units.item.change.position', onChangeUnitPosition, this);

    }

    /*
     * Properties
     */

    get size() {
        return this._size;
    }
    get cellSize() {
        return this._cellSize;
    }
    get units() {
        return this._units;
    }
    get matrix() {
        return this._matrix;
    }



}

function reset(size, units = []) {
    this._size.setLocal(size);
    setupMatrix(this);
    units.forEach(unitData => {
        const unit = new UNIT_CLASSES[unitData.type]();
        delete unitData.type;
        unit.import(unitData);
        this.units.add(unit);
    });
}


/**
 * Ermitteln die nächste freie Position neben der nähe der angegebenen Position.
 * @param  {Map} map
 * @param  {Unit} unit
 * @param  {Position} position
 * @param  {Number} radius
 * @return {MoveData}
 */
function findPath(unit, position, options = {}, radius = 1) {

    options = Object.assign(options, {
        /**
         * Wenn angegebene Position besetzt ist, wird eine in der nähe gesucht.
         * @type {Boolean}
         */
        near: true
    });
    return this._matrix.getPath(unit.position, position).then(path => {
        if (path) {
            for (var i = 0; i < path.length; i++) {
                path[i] = new Position(path[i]);
            }
            return path;
        }
        if (options.near) {
            return findPath.bind(this)(unit, this.getPositionAroundPosition(position, radius), options, radius + 1);
        }
    });
}

class MoveData {
    constructor(startPosition, path) {
        this.startPosition = startPosition;
        this.endPosition = path[0];
        this.path = path;
        this.length = path.length;
    }
}



function onAddUnit(unit) {
    this.addNeighbor(unit.position.x, unit.position.y, unit);
    if (unit.isType(UNIT_TYPES.NEIGHBOR)) {
        this.refreshNeighbor(unit, UNIT_TYPES.NEIGHBOR);
    }
}

function onRemoveUnit(unit) {
    this.removeNeighbor(unit.position.x, unit.position.y, unit);
    if (unit.isType(UNIT_TYPES.NEIGHBOR)) {
        this.refreshNeighbor(unit, UNIT_TYPES.NEIGHBOR);
    }
}

function onAddRemoveUnit(unit) {

    const x = unit.position.x,
        y = unit.position.y;

    if (unit.type === UNIT_TYPES.ROAD.DEFAULT) {
        this._matrix.updateCell(x, y, GRID_CELL_TYPES.ROAD);
    } else {

        this._units.sort((a, b) => {
            if (!a.walkable && b.walkable) {
                return 1;
            } else if (a.walkable && !b.walkable) {
                return -1;
            } else {
                return 0;
            }
        });

        this._matrix.updateCell(x, y, this.isCellWalkable(unit.position.x, unit.position.y));
    }

    this.refresh();
}


function onChangeUnitPosition(unit, position, lastPosition) {
    this.removeNeighbor(lastPosition.x, lastPosition.y, unit);

    this._matrix.updateCell(lastPosition.x, lastPosition.y, this.isCellWalkable(lastPosition.x, lastPosition.y));
    this._matrix.updateCell(position.x, position.y, this.isCellWalkable(position.x, position.y));

    this.addNeighbor(position.x, position.y, unit);
    this.refresh();



}

function setupMatrix(map) {
    map._neighborMatrix = {};
    map._matrix = new Matrix(map._size, false);
}




// function roundRadius(xc, yc, radius) {
//
//     const positions = [];
//     let width = radius * 2,
//         height = radius * 2;
//     const data = Array();
//     for (var i = -width; i <= width; i++) {
//         data[i] = [];
//         for (var j = -height; j <= height; j++) {
//             data[i][j] = false;
//         }
//     }
//     console.log(data);
//     for (let y_ = -radius; y_ <= radius; y_++) {
//         for (let x_ = -radius; x_ <= radius; x_++) {
//             if (x_ * x_ * radius * radius + y_ * y_ * radius * radius <= radius * radius * radius * radius) {
//                 console.log(xc + x_, yc + y_);
//                 data[xc + x_][yc + y_] = true;
//                 positions.push([xc + x_, yc + y_]);
//             }
//         }
//     }
//     console.log('testA', data, data.map(d => {
//         return d.join(', ');
//     }).join("\n"), positions);
// }
//
// function rectRadius(xc, yc, radius) {
//     const width = radius;
//     const positions = [];
//     const data = Array(width);
//     for (var i = -width; i <= width; i++) {
//         data[i] = [];
//         for (var j = -width; j <= width; j++) {
//             data[i][j] = false;
//         }
//     }
//     for (var x = xc - width; x <= xc + width; x++) {
//         for (var y = yc - width; y <= yc + width; y++) {
//             if (!data[x]) {
//                 data[x] = [];
//             }
//             data[x][y] = true;
//             positions.push([x, y]);
//         }
//     }
//     console.log('testB', data, data.map(d => {
//         return d.join(', ');
//     }).join("\n"), positions);
// }
