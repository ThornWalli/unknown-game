'use strict';

import {
    Sprite as PIXI_Sprite,
    Texture
} from 'pixi.js';
import Sprite from '../Sprite';

export default class Area extends Sprite {
    constructor(unit, spriteType = 'area_default') {
        super(unit, getSpriteType(spriteType));
        this._originSpriteType = spriteType;

        this.unit.on('change.neighbors', onChangeNeighbors, this);
        onChangeNeighbors.bind(this)(unit.neighbors);

    }
    onAdded() {}
}


function onChangeNeighbors(neighbors) {
    createNeighborsSprites(this.root, this._originSpriteType, neighbors,false);
}


function createNeighborsSprites(sprite, spriteType, neighbors) {

    sprite.children.forEach(childSprite => sprite.removeChild(childSprite));
    neighbors.forEach(neighbor => {
        const neighborSprite = new PIXI_Sprite(Texture.fromFrame(getSpriteType(spriteType, 1 + neighbor[1], 1 + neighbor[0])));
        neighborSprite.anchor.set(0.5);
        sprite.addChild(neighborSprite);
    });
}

function getSpriteType(spriteType, x = 1, y = 1) {
    return `${spriteType}_${x}_${y}`;
}
