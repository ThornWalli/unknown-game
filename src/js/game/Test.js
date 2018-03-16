'use strict';

export default class Test {

    constructor(app) {
        this.app = app;
    }

    /*
     * Functions
     */

    start() {}

    /*
     * Properties
     */

    get size() {
        return null;
    }
    get display() {
        return this.app.display;
    }
    get units() {
        return this.app.map.units;
    }
    get map() {
        return this.app.map;
    }
    get loadModules() {
        return false;
    }

}
