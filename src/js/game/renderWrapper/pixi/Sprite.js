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

        this._originSpriteType = this._spriteType = spriteType;
        this._unit = unit;

        this.setupSprite();

        // Selected Helper
        this._selectedHelper = createSelectedHelper(this._root.width, this._root.height);
        this.addChild(this._selectedHelper);

        unit.on('change.selected', onChangeUnitSelected, this);
        this._unit.setSprite(this);

        if (!this._unit.ready) {
            this._unit.on('module.ready', this.onModuleReady, this);
        } else {
            this.onModuleReady(this._unit.module);
        }

    }

    /*
     * Functions
     */

    destroy() {
        this._unit.off(null, null, this);
        PIXI_Sprite.prototype.destroy.apply(this, arguments);
    }



    setupSprite() {
        // Root
        let spriteType = this._spriteType || this.unit.spriteType;
        if (!/_\d$/.test(spriteType)) {
            spriteType += '_0_0';
        }

        this._root = createSprite(spriteType);
        this.addChild(this._root);
    }

    setFrame(x, y = 0) {
        const spriteType = this._spriteType || this.unit.spriteType;
        this._root.texture = Texture.fromFrame(`${spriteType}_${x}_${y}`);
    }

    /*
     * Events
     */
    onAdded() {}
    onModuleReady() {}
    /*
     * Properties
     */
    get originSpriteType() {
        return this._originSpriteType;
    }
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
