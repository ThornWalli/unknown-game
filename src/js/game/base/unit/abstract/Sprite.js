'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

/**
 * Abstract Class Sprite
 */
const Sprite = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.SPRITE);
        this._sprite = null;
        this._spriteType = UNIT_TYPES.DEFAULT;
    }
    /*
     * Functions
     */
    setSpriteType(type) {
        this._spriteType = type;
    }
    setSprite(sprite) {
        this._sprite = sprite;
    }
    renderSprite() {
        this.trigger('render.sprite', this);
    }

    onActionComplete() {
        this.renderSprite();
    }

    /*
     * Properties
     */

    get sprite() {
        return this._sprite;
    }
    get spriteType() {
        return this._spriteType;
    }

};
UNIT_TYPES.SPRITE = 'sprite';
UNIT_CLASSES[UNIT_TYPES.SPRITE] = Sprite;

export {
    Sprite as
    default
};
