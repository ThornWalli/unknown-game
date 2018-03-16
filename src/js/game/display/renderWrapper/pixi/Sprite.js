'use strict';
import {
    CELL_SIZE
} from './utils';
import {
    SCALE_MODES,
    Sprite as PIXI_Sprite,
    Texture
} from 'pixi.js';

export default class Sprite extends PIXI_Sprite {
    constructor(unit, spriteType = 'default') {
        super();
        // this.pivot.set(-CELL_SIZE.width);
        // this.anchor.set(0.5);
        this._root = new PIXI_Sprite(Texture.fromFrame(unit.spriteType || spriteType));
        this._root.anchor.set(0.5);
        this._root.pivot.set();
        this._root.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        this._root.width = CELL_SIZE.width;
        this._root.height =  CELL_SIZE.height;
        this.addChild(this._root);

        this._spriteType = spriteType;
        this._unit = unit;
        unit.setSprite(this);
    }

    // Functions
    onAdded() {}
    // Properties
    get spriteType() {
        return this._spriteType;
    }
    get unit() {
        return this._unit;
    }
    get root() {
        return this._root;
    }
}
