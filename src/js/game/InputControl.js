'use strict';

import Events from './base/Events';

export default class InputControl extends Events {
    constructor(app) {
        super();
        this._app = app;
    }
    pointerDown(event) {
        this.trigger('pointerdown', event);
    }
    pointerUp(event) {
        this.trigger('pointerup', event);
    }
    pointerMove(event) {
        this.trigger('pointermove', event);
    }
    keyDown(event) {
        this.trigger('keydown', event);
    }
    keyUp(event) {
        this.trigger('keyup', event);
    }

}
