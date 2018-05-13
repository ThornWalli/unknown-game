'use strict';

import {
    Sprite as PIXI_Sprite,
    Texture
} from 'pixi.js';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../../types';

import Storage from '../Storage';

class Container extends Storage {
    constructor(unit, spriteType = UNIT_TYPES.BUILDING.STORAGE.CONTAINER) {
        super(unit, spriteType);
    }

    setupSprite() {
        Storage.prototype.setupSprite.apply(this, arguments);
        const sprite = this.root;

        sprite.children.forEach(childSprite => sprite.removeChild(childSprite));
        this._containerSprites = [];
        for (var i = 1; i < 10; i++) {
            const subSprite = new PIXI_Sprite(Texture.fromFrame(getSpriteType(this.spriteType, i, 0)));
            subSprite.anchor.set(0.5);
            subSprite.visible = false;
            sprite.addChild(subSprite);
            this._containerSprites.push(subSprite);
        }
    }
    onModuleReady(module) {
        Storage.prototype.onModuleReady.apply(this, arguments);
        module
            .on('storage.value.add', onChangeStorageValue, this)
            .on('storage.value.remove', onChangeStorageValue, this);
    }

    destroy() {
        this.unit.module.off(null, null, this);
        Storage.prototype.destroy.apply(this, arguments);
    }
}

SPRITE_CLASSES[UNIT_TYPES.BUILDING.STORAGE.CONTAINER] = Container;
export default Container;



function onChangeStorageValue(itemStorage) {
    console.log(itemStorage.totalItemStorageValue , itemStorage.maxItemStorageItemValue);
    const count = Math.round(this._containerSprites.length * (itemStorage.totalItemStorageValue / itemStorage.maxItemStorageItemValue));
    console.log(count);
    for (var i = 0; i < this._containerSprites.length; i++) {
        this._containerSprites[i].visible = i < count;
    }
}


function getSpriteType(spriteType, x = 1, y = 1) {
    return `${spriteType}_${x}_${y}`;
}
