'use strict';

import {
    Sprite as PIXI_Sprite,
    Texture
} from 'pixi.js';

import {
    ticker
} from '../../../base/Ticker';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import {
    default as Sprite,
    getSpriteType
} from '../Sprite';

const GROUND_DURATION = 100,
    SPRITE_LENGTH = 6;

class ContainerTeleporter extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER) {
        super(unit, spriteType);
        const sprite = this.root;

        sprite.children.forEach(childSprite => sprite.removeChild(childSprite));
        this._containerSprites = [];
        for (let i = 1; i < SPRITE_LENGTH; i++) {
            const subSprite = new PIXI_Sprite(Texture.fromFrame(getSpriteType(this.spriteType, i, 0)));
            subSprite.anchor.set(0.5);
            subSprite.visible = false;
            sprite.addChild(subSprite);
            this._containerSprites.push(subSprite);
        }
        this._groundSprites = [];
        for (let i = 0; i < SPRITE_LENGTH; i++) {
            const subSprite = new PIXI_Sprite(Texture.fromFrame(getSpriteType(this.spriteType, i, 1)));
            subSprite.anchor.set(0.5);
            subSprite.visible = false;
            sprite.addChild(subSprite);
            this._groundSprites.push(subSprite);
        }
        this._lastGroundSprite = 0;
        this._groundSprites[this._lastGroundSprite].visible = true;

        this.showContainer(0);


    }

    onModuleReady(module) {
        Sprite.prototype.onModuleReady.apply(this, arguments);
        module
            .on('storage.value.add', onChangeStorageValue, this)
            .on('storage.value.remove', onChangeStorageValue, this)
            .on('teleporter.receive', () => this.openGround(), this)
            .on('teleporter.request', () => this.closeGround(), this);
    }

    onTickerOpenGround(tick) {
        this._groundSprites[this._lastGroundSprite].visible = false;
        this._groundSprites[this._lastGroundSprite = Math.round((this._groundSprites.length - 1) * tick)].visible = true;
    }

    onTickerCloseGround(tick) {
        this._groundSprites[this._lastGroundSprite].visible = false;
        this._groundSprites[this._lastGroundSprite = Math.round((this._groundSprites.length - 1) * (1 - tick))].visible = true;
    }

    openGround(cb) {
        if (!this._isGroundOpen) {
            this._isGroundOpen = true;
            ticker.register(this.onTickerOpenGround.bind(this), () => {
                return cb;
            }, GROUND_DURATION * SPRITE_LENGTH, true);
        }
    }
    closeGround(cb) {
        if (this._isGroundOpen) {
            this._isGroundOpen = false;
            ticker.register(this.onTickerCloseGround.bind(this), () => {
                return cb;
            }, GROUND_DURATION * SPRITE_LENGTH, true);
        }
    }

    showContainer(value) {
        for (var i = 0; i < Math.round(this._containerSprites.length * value); i++) {
            this._containerSprites[i].visible = true;
        }
    }

    hideContainer() {
        this._containerSprites.forEach(container => container.visible = false);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER] = ContainerTeleporter;
export default ContainerTeleporter;

function onChangeStorageValue(itemStorage) {
    const count = Math.round(this._containerSprites.length * (itemStorage.totalItemStorageValue / itemStorage.maxItemStorageItemValue));
    this._containerSprites.forEach((sprite, i) => sprite.visible = i < count);
}
