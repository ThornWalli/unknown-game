'use strict';

export default class RenderWrapper {
    constructor(display) {
        this._display = display;
    }
    /**
     * @override
     */
    render() {}
    /*
 * Properties
 */
    get display() {
        return this._display;
    }
    get map() {
        return this._display.app.map;
    }
}
