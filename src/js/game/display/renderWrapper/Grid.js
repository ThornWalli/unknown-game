'use strict';
import Position from '../../base/Position';

import {
    TYPES as UNIT_TYPES
} from '../../utils/unit';

import RenderWrapper from '../RenderWrapper';

import RenderTimer from '../../base/RenderTimer';

const UNIT_TYPE_PATHFINDER_PATH = 'pathfinderPath';

export default class DrawGrid extends RenderWrapper {

    constructor(display) {
        super(display);

        this._ready = ready.bind(this)();
    }



    setup() {}
    get ready() {
        return this._ready;
    }

    get visibleDimension() {
        return this._display.visibleDimension;
    }

    drawBackground(offset, force) {
        const visibleSize = this._display.visibleSize;
        if (!this._hasTmpBackground || force) {
            this._context.beginPath();
            for (let y = 0; y < visibleSize.height; y++) {
                for (let x = 0; x < visibleSize.width; x++) {
                    this.drawCell(
                        new Position(this._display.visibleBounds.min.x + x, this._display.visibleBounds.min.y + y),
                        offset
                    );
                }
            }
            this._context.stroke();
            this.createTmpBackground();
        }
        this._context.drawImage(this._tmpBackgroundCanvas, 0, 0);
    }

    createTmpBackground() {
        this._tmpBackgroundCanvas.width = this.visibleDimension.width;
        this._tmpBackgroundCanvas.height = this.visibleDimension.height;
        this._tmpBackgroundContext.clearRect(0, 0, this.visibleDimension.width, this.visibleDimension.height);
        this._tmpBackgroundContext.drawImage(this._context.canvas, 0, 0);
        this._hasTmpBackground = true;
    }

    drawUnits(offset) {
        this._context.beginPath();
        this.map.units.forEach(unit => {
            // type = ;unit.isSelected ? CELL_TYPES.UNIT_SELECTED : CELL_TYPE
            this.drawCell(unit.position, offset, unit.type, unit.selected);
            if (!!unit.activeAction && unit.activeAction.type === 'move') {
                unit.activeAction.moveData.path.forEach(position => {
                    this.drawCell(position, offset, UNIT_TYPE_PATHFINDER_PATH);
                });
            }
        });
        this._context.stroke();
    }

    render(force) {
        if (this._ready) {

            this._context.clearRect(0, 0, this.visibleDimension.width, this.visibleDimension.height);
            const offset = this._display.getVisibleOffset();
            offset.clampValuesLocal(0, 0);
            // offset.setValuesLocal(0,0)
            this.drawBackground(offset, force);

            this.drawUnits(offset);

        }
    }

    intersectMap(position) {
        return this._display.visibleBounds.intersect(position);
    }

    // this.drawCell(unit.position, offset, );
    // drawCellByUnit(unit, offset) {
    //     const position = unit.position;
    //
    //     if (this.intersectMap(position)) {
    //
    //
    //         const min = this._display.visibleBounds.min;
    //         let x = position.x,
    //             y = position.y;
    //
    //         const sprite = unit.sprite;
    //         if (sprite) {
    //             if (unit.isType(UNIT_TYPES.SPRITE)) {
    //                 x = offset.x + (x - min.x) * this.map.cellSize.width;
    //                 y = offset.y + (y - min.y) * this.map.cellSize.height;
    //                 // console.log(1+val[0][0],1+val[0][1]);
    //                 if (unit.isType(UNIT_TYPES.NEIGHBOR)) {
    //                     this._context.drawImage(sprite[1][1], x, y);
    //                     unit.neighbors.forEach(value => {
    //                         this._context.drawImage(sprite[1 + value[0]][1 + value[1]], x, y);
    //                     });
    //                 } else {
    //                     // const width = this.map.cellSize.width,
    //                     //     height = this.map.cellSize.height;
    //                     // this._context.translate(x + width / 2, y + height / 2);
    //                     // this._context.rotate(getAngle(unit.direction));
    //                     // * Math.PI / 180
    //
    //
    //                     this._context.drawImage(sprite, x, y);
    //
    //                     // this._context.drawImage(sprite[0][0], x, y);
    //
    //                 }
    //
    //             }
    //         } else {
    //             this.drawCell(position, offset, unit.type, unit.selected, unit.neighbors);
    //         }
    //
    //     }
    // }


    drawCell(position, offset, type = UNIT_TYPES.UNIT, selected = false) {
        if (this.intersectMap(position)) {
            const min = this._display.visibleBounds.min;
            let x = position.x,
                y = position.y;

            const styles = getCellStyles();

            if (UNIT_TYPES.ROAD === type) {
                this._context.fillStyle = styles[type].fill;
                this._context.strokeStyle = styles[type].stroke;
                x = offset.x + (x - min.x) * this.map.cellSize.width;
                y = offset.y + (y - min.y) * this.map.cellSize.height;
                this._context.fillRect(x, y, this.map.cellSize.width, this.map.cellSize.height);

                this._context.rect(x - 0.5, y - 0.5, this.map.cellSize.width, this.map.cellSize.height);


            } else {

                if (selected) {
                    this._context.fillStyle = styles[type].selected.fill;
                    this._context.strokeStyle = styles[type].selected.stroke;
                } else {
                    this._context.fillStyle = styles[type].fill;
                    this._context.strokeStyle = styles[type].stroke;
                }

                x = offset.x + (x - min.x) * this.map.cellSize.width;
                y = offset.y + (y - min.y) * this.map.cellSize.height;
                this._context.fillRect(x, y, this.map.cellSize.width, this.map.cellSize.height);

                this._context.rect(x - 0.5, y - 0.5, this.map.cellSize.width, this.map.cellSize.height);

            }


            if (type !== 'default') {
                this._context.fillStyle = 'red';
                this._context.font = "8px sans-serif";
                const text = `${type[0].toUpperCase()}${type[1].toUpperCase()}`;
                this._context.fillText(text, x + 2, y + 8);
            }


        }
    }
}

function ready() {
    return new Promise(resolve => {
        this._canvas = document.createElement('canvas');
        this.display.containerEl.appendChild(this._canvas);
        this._context = this._canvas.getContext("2d");
        this._canvas.width = this.display.visibleDimension.width;
        this._canvas.height = this.display.visibleDimension.height;

        this._tmpBackgroundCanvas = document.createElement('canvas');
        this._tmpBackgroundContext = this._tmpBackgroundCanvas.getContext('2d');

        this.display.app.map.on('refresh', () => {
            this._renderTimer.add(this.render.bind(this), 'drawGrid');
        }, this);
        this._renderTimer = new RenderTimer();
        this._renderTimer.start();
        resolve();
    }).catch(err => {
        throw err;
    });

}


// #444444
// #cccccc
// #fea3aa
// #f8b88b
// #faf884
// #bebd73
// #baed91
// #b2cefe
// #f2a2e8
// CELL_STYLES
// #181818
// #ffffff
// #fff85b
// #52d8ff
// #ff5252

function getCellStyles() {
    const styles = {};
    styles[UNIT_TYPES.UNIT] = {
        fill: '#444',
        stroke: '#000000'
    };
    styles[UNIT_TYPES.FIGURE] = {
        fill: '#faf884',
        stroke: '#000000',
        selected: {
            fill: 'rgb(5, 7, 123)',
            stroke: '#000000'
        }
    };
    styles[UNIT_TYPES.WALL] = {
        fill: '#baed91',
        stroke: '#000000'
    };
    styles[UNIT_TYPES.BOT] = {
        fill: '#bebd73',
        stroke: '#000000'
    };
    styles[UNIT_TYPES.ROAD] = {
        fill: '#333333',
        stroke: '#000000'
    };

    styles[UNIT_TYPE_PATHFINDER_PATH] = {
        fill: 'rgba(178, 206, 254, 0.1)',
        stroke: '#000000'
    };



    styles[UNIT_TYPES.STORE] = {
        fill: '#FFFFFF',
        stroke: '#000000'
    };

    styles[UNIT_TYPES.RESOURCE] = {
        fill: '#52d8ff',
        stroke: '#000000'
    };

    styles[UNIT_TYPES.VEHICLE.HARVESTER] = {
        fill: '#f8b88b',
        stroke: '#000000',
        selected: {
            fill: 'rgb(5, 7, 123)',
            stroke: '#000000'
        }
    };

    styles[UNIT_TYPES.HOME] = {
        fill: '#FFFFFF',
        stroke: '#000000',
        selected: {
            fill: 'rgb(5, 7, 123)',
            stroke: '#000000'
        }
    };
    return styles;
}
