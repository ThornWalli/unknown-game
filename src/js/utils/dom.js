"use strict";

const DOUBLE_CLICK_DELAY = 500; // ms

document.documentElement.style.overflowY = 'scroll';
const scrollbarWidth = window.innerWidth - document.body.offsetWidth;
document.documentElement.style.overflowY = null;

function touchEvent(scope, event, func) {
    if (event.touches && event.touches.length > 0) {
        event.preventDefault();
        const touch = event.touches[0];
        console.error('touch', touch);
        event.clientX = touch.clientX;
        event.clientY = touch.clientY;
    }
    if (func) {
        func.bind(this)(event);
    }
    if (event.touches && event.touches.length > 0) {
        return true;
    } else {
        return false;
    }
}

var doubleTabIndicator;

function doubleTab() {
    if (!doubleTabIndicator) {
        doubleTabIndicator = Date.now();
    } else {
        console.log((Date.now() - doubleTabIndicator), DOUBLE_CLICK_DELAY, (Date.now() - doubleTabIndicator) < DOUBLE_CLICK_DELAY);
        if ((Date.now() - doubleTabIndicator) < DOUBLE_CLICK_DELAY) {
            doubleTabIndicator = null;
            return true;
        }
        doubleTabIndicator = null;
    }
    return false;
}

export {
    touchEvent,
    doubleTab,
    scrollbarWidth
};
