'use strict';

import {
    Sprite as PIXI_Sprite,
    Texture
} from 'pixi.js';

/**
 * Abstract Class Action
 */
const Area = Abstract => class extends Abstract {
    constructor(unit, spriteType) {
        super(unit, getSpriteType(spriteType));
        this._originSpriteType = spriteType;

        this.unit.on('change.neighbors', onChangeNeighbors, this);
        onChangeNeighbors.bind(this)(unit.neighbors);

    }
    onAdded() {}
};

export default Area;



function onChangeNeighbors(neighbors) {
    createNeighborsSprites(this.root, this._originSpriteType, neighbors, false);
}


function createNeighborsSprites(sprite, spriteType, neighbors) {

    sprite.children.forEach(childSprite => sprite.removeChild(childSprite));
    neighbors.forEach(neighbor => {
        const neighborSprite = new PIXI_Sprite(Texture.fromFrame(getSpriteType(spriteType, 1 + neighbor[0], 1 + neighbor[1])));
        neighborSprite.anchor.set(0.5);
        sprite.addChild(neighborSprite);
    });
}

function getSpriteType(spriteType, x = 1, y = 1) {
    return `${spriteType}_${y}_${x}`;
}
