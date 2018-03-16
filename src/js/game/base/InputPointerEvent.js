'use strict';

export default class InputPointerEvent {
    constructor(event) {
        // Left Mouse Click
        this.primaryClick = event.buttons === 1;
        // Right Mouse Click
        this.secondaryClick = event.buttons === 2;
        this.x = event.clientX;
        this.y = event.clientY;
    }
}
