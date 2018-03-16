'use strict';

import Events from './Events';

class RenderTimer extends Events {
    constructor(name) {
        super();
        this._name = name;
        this._draws = [];
        this._drawNames = [];
        this._startTimestamp = null;
        this._frame = null;
    }

    /*
     * Functions
     */

    start() {
        this._startTimestamp = Date.now();
    }
    stop() {}


    loop() {
        if (!this._frame) {
            this._frame = global.requestAnimationFrame(() => {
                const now = this.now;
                const draws = this._draws;
                this._draws = [];
                while (draws.length) {
                    const draw = draws.shift();
                    draw.func(now);
                    if (draw.name) {
                        this._drawNames.splice(this._drawNames.indexOf(draw.name),1);
                    }
                }
                this._frame = null;
            });
        }
    }

    add(func, name) {
        if (!name || this._drawNames.indexOf(name) === -1) {
            if (name) {
                this._drawNames.push(name);
            }
            this._draws.push({
                name,
                func
            });
            this.loop(this);
        }
    }

    remove(func) {
        if (this._draws.indexOf(func) > -1) {
            this._draws.splice(this._draws.indexOf(func), 1);
        }
    }

    /*
     * Properties
     */

    get startTimestamp() {
        return this._startTimestamp;
    }


    get now() {
        return Date.now();
    }
}

export default RenderTimer;
