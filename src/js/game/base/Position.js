'use strict';

import Size from './Size';

export default class Position {
    constructor(x = 0, y = 0) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.setValuesLocal(x, y);
    }

    getDistance(position) {
        const x = diff(this.x, position.x),
            y = diff(this.y, position.y);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    getLength(position) {
        return new Size(diff(this.x, position.x), diff(this.y, position.y));
    }

    is(position) {
        return this.x === position.x && this.y === position.y;
    }
    isValues(x, y) {
        return this.x === x && this.y === y;
    }
    clone() {
        return new Position(this.x, this.y);
    }

    /*
     * Add
     */
    add(position) {
        return this.clone().addLocal(position);
    }
    addValues(x, y) {
        return this.clone().addValuesLocal(x, y);
    }
    addLocal(position) {
        this.addValuesLocal(position.x, position.y);
        return this;
    }
    addValuesLocal(x, y) {
        this.setValuesLocal(this.x + x, this.y + y);
        return this;
    }

    /*
     * Subtract
     */
    subtract(position) {
        return this.clone().subtractLocal(position);
    }
    subtractValues(x, y) {
        return this.clone().subtractValuesLocal(x, y);
    }
    subtractLocal(position) {
        this.subtractValuesLocal(position.x, position.y);
        return this;
    }
    subtractValuesLocal(x, y) {
        this.setValuesLocal(this.x - x, this.y - y);
        return this;
    }

    /*
     * Multiply
     */
    multiply(position) {
        return this.clone().multiplyLocal(position);
    }
    multiplyValues(x, y) {
        return this.clone().multiplyValuesLocal(x, y);
    }
    multiplyLocal(position) {
        this.multiplyValuesLocal(position.x, position.y);
        return this;
    }
    multiplyValuesLocal(x, y) {
        this.setValuesLocal(this.x * x, this.y * y);
        return this;
    }

    /*
     * Divide
     */
    divide(position) {
        return this.clone().divideLocal(position);
    }
    divideValues(x, y) {
        return this.clone().divideValuesLocal(x, y);
    }
    divideLocal(position) {
        this.divideValuesLocal(position.x, position.y);
        return this;
    }
    divideValuesLocal(x, y) {
        this.setValuesLocal(this.x / x, this.y / y);
        return this;
    }

    /*
     * Floor
     */
    floor() {
        return Position(Math.floor(this.x), Math.floor(this.y));
    }
    floorLocal() {
        this.setValuesLocal(Math.floor(this.x), Math.floor(this.y));
        return this;
    }

    /*
     * Clamp
     */
    clamp(min, max) {
        return this.clone().clampLocal(min, max);
    }
    clampValues(minX, minY, maxX, maxY) {
        return this.clone().clampValuesLocal(minX, minY, maxX, maxY);
    }
    clampLocal(min, max) {
        return this.clampValuesLocal(min.x, min.y, max.x, max.y);
    }
    clampValuesLocal(minX, minY, maxX, maxY) {
        this.x = clamp(this.x, minX, maxX);
        this.y = clamp(this.y, minY, maxY);
        return this;
    }

    /*
     * Set
     */
    set(position) {
        return this.clone().setLocal(position.x, position.x);
    }
    setValues(x, y) {
        return this.clone().setValuesLocal(x, y);
    }
    setLocal(position) {
        return this.setValuesLocal(position.x, position.y);
    }
    setValuesLocal(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /*
     * ParseInt
     */
    parseInt() {
        return this.clone().parseIntLocal();
    }
    parseIntLocal() {
        return this.setValuesLocal(parseInt(this.x), parseInt(this.y));
    }

    /*
     * ParseFloat
     */
    parseFloat() {
        return this.clone().parseIntLocal();
    }
    parseFloatLocal() {
        return this.setValuesLocal(global.parseFloat(this.x), global.parseFloat(this.y));
    }

    /*
     * MathRound
     */
    mathRound() {
        return this.clone().mathRoundLocal();
    }
    mathRoundLocal() {
        return this.setValuesLocal(Math.round(this.x), Math.round(this.y));
    }

    /*
     * MathCeil
     */
    mathCeil() {
        return this.clone().mathCeilLocal();
    }
    mathCeilLocal() {
        return this.setValuesLocal(Math.ceil(this.x), Math.ceil(this.y));
    }

    /*
     * MathFloor
     */
    mathFloor() {
        return this.clone().mathFloorLocal();
    }
    mathFloorLocal() {
        return this.setValuesLocal(Math.floor(this.x), Math.floor(this.y));
    }

    get class() {
        return Position;
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    }
    toArray() {
        return [this.x, this.y];
    }

    toString(){
        return `Position: ${this.x} / ${this.y}`;
    }

    /**
     * Calculate distance between two Positions.
     * @param  {Position} position
     * @return {Number}
     */
    distance(position) {
        var a = Math.pow(position.x - this.x, 2);
        var b = Math.pow(position.y - this.y, 2);
        return Math.sqrt(a + b);
    }
}

function clamp(value, min, max) {
    if (min !== undefined) {
        value = Math.max(value, min);
    }
    if (max !== undefined) {
        value = Math.min(value, max);
    }
    return value;
}

function diff(num1, num2) {
    if (num1 > num2) {
        return (num1 - num2);
    } else {
        return (num2 - num1);
    }
}


// function RadToPosition(rad) {
//     return new Position(
//         Math.cos(rad),
//         Math.sin(rad));
// }
//
// function PositionToRad(x, y) {
//     return Math.atan2(y, x);
// }
//
// function radBetween(rad1, rad2) {
//     return rad2 - rad1;
// }
