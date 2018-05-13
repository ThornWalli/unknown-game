'use strict';

const DIRECTIONS = {
    DEFAULT: 'default',
    LEFT: 'left',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom'
};

const TRANSFER_DIRECTIONS = {
    NONE: -1,
    BOTH: 0,
    IN: 1,
    OUT: 2
};

export default DIRECTIONS;
export {
    DIRECTIONS,
    TRANSFER_DIRECTIONS
};
