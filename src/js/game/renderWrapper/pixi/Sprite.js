'use strict';
import {
    CELL_SIZE
} from './utils';
import {
    SCALE_MODES,
    Sprite as PIXI_Sprite,
    Texture,
    Graphics
} from 'pixi.js';

export default class Sprite extends PIXI_Sprite {
    constructor(unit, spriteType) {
        super();

        this._spriteType = spriteType;

        // Root
        this._root = createSprite(spriteType || unit.spriteType);
        this.addChild(this._root);

        // Selected Helper
        this._selectedHelper = createSelectedHelper(this._root.width, this._root.height);
        this.addChild(this._selectedHelper);

        this._unit = unit;
        unit.on('selected.change',onChangeUnitSelected, this);
        this._unit.setSprite(this);

    }

    /*
     * Functions
     */
    onAdded() {}
    /*
     * Properties
     */
    get spriteType() {
        return this._spriteType;
    }
    get unit() {
        return this._unit;
    }
    get root() {
        return this._root;
    }
    get selectedLayer() {
        return this._selectedHelper;
    }
}

// Events

function onChangeUnitSelected(unit, selected) {
    this.selectedLayer.visible = selected;
}

// Functions

function createSprite(spriteType) {
    const sprite = new PIXI_Sprite(Texture.fromFrame(spriteType));
    sprite.anchor.set(0.5);
    sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    sprite.width = CELL_SIZE.width;
    sprite.height = CELL_SIZE.height;
    return sprite;
}

function createSelectedHelper(width, height, strokeWidth = 1) {
    var graphics = new Graphics();
    graphics.lineStyle(strokeWidth, 0xbaed91, 1);
    graphics.drawRect(-width / 2 + (strokeWidth / 2), -height / 2 + (strokeWidth / 2), width, height);
    graphics.visible = false;
    return graphics;
}
