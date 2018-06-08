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

        this.unit.on('change.neighborPositions', onChangeNeighborPositions, this);
        onChangeNeighborPositions.bind(this)(unit.neighborPositions);

    }
    onAdded() {}
};

export default Area;

function onChangeNeighborPositions() {
    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {
        // console.log('??');
        createNeighborsSprites(this.unit, this.root, this._originSpriteType, false);
    // }, 1000);

}


function createNeighborsSprites(unit, sprite, spriteType) {
    sprite.children.forEach(childSprite => sprite.removeChild(childSprite));
    unit.neighborPositions.forEach((neighborPosition, i) => {
        if (!unit.neighbors || unit.neighbors && unit.isType(unit.neighbors[i].type)) {
            const neighborSprite = new PIXI_Sprite(Texture.fromFrame(getSpriteType(spriteType, 1 + neighborPosition[0], 1 + neighborPosition[1])));
            neighborSprite.anchor.set(0.5);
            sprite.addChild(neighborSprite);
        }
    });
}

function getSpriteType(spriteType, x = 1, y = 1) {
    return `${spriteType}_${y}_${x}`;
}
