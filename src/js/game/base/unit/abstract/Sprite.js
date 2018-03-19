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
        this._spriteVisible = true;
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
        if (this._sprite) {
            this.trigger('sprite.render', this);
        }
    }
    /*
     * Properties
     */
    get spriteVisible() {
        return this._spriteVisible;
    }
    set spriteVisible(spriteVisible) {
        this._spriteVisible = spriteVisible;
        this.trigger('sprite.visible.change', this, spriteVisible);
    }
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
