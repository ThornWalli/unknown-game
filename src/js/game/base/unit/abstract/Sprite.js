'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

import {
    DIRECTIONS
} from '../../../utils/unit';

/**
 * Abstract Class Sprite
 */
const Sprite = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(TYPES.SPRITE);
        this._spriteVisible = true;
        this._sprite = null;
        this._spriteType = TYPES.DEFAULT;
    }
    // Functions
    setSpriteType(type) {
        this._spriteType = type;
    }
    setSprite(sprite) {
        this._sprite = sprite;
    }
    renderSprite() {
        if (this._sprite) {
            render.bind(this)();
            this.trigger('render.sprite', this);
        }
    }
    // Properties
    get spriteVisible() {
        return this._spriteVisible;
    }
    set spriteVisible(spriteVisible) {
        this._spriteVisible = spriteVisible;
        this.trigger('change.sprite.visible', this, spriteVisible);
    }
    get sprite() {
        return this._sprite;
    }
    get spriteType() {
        return this._spriteType;
    }

};
TYPES.SPRITE = 'sprite';
CLASSES[TYPES.SPRITE] = Sprite;


function render() {
    // sprite.rotation =getSpriteDirectionRotation(this._sprite, this.direction);
}

export {
    Sprite as
    default
};
