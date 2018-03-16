'use strict';


const KEY_TYPES = {
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_BOTTOM: 40
};

class InputKeyEvent {
    constructor(event) {
        this.code = event.keyCode;
        this.alt = event.altKey;
        this.ctrl = event.ctrlKey;
        this.meta = event.metaKey;
        this.shift = event.shiftKey;
    }
    get KEY_TYPES() {
        return KEY_TYPES;
    }
}

export {
    InputKeyEvent as
    default

};
