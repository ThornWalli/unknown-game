'use strict';

import Size from '../../../base/Size';
import logImage from 'console-image';

import {
    DIRECTIONS
} from '../../../utils/unit';

import {
    SPRITES,
    SPRITES_DATA
} from '../../../utils/sprites';

import {
    Texture,
    BaseTexture,
    loaders
} from 'pixi.js';


const CELL_SIZE = new Size(20, 20);


function getDirectionRotation(direction) {
    switch (direction) {
        case DIRECTIONS.RIGHT:
        return Math.PI / 2;
        case DIRECTIONS.TOP:
            return 0;
        case DIRECTIONS.LEFT:
        return -Math.PI / 2;
        case DIRECTIONS.BOTTOM:
        return Math.PI;
        default:
            return 0;
    }
}


function parsingMiddleware(resource, next) {
    // console.log('parsingMiddleware', arguments);
    const data = SPRITES_DATA.find(data => {
        if (resource.name === data.name) {
            return true;
        }
    });
    splitImageSprite(data, resource.data);
    next();
}
/**
 * Lädt die Sprites.
 */
function loadFrames() {
    return new Promise(resolve => {
        const loader = new loaders.Loader();
        SPRITES_DATA.forEach(data => loader.add(data.name, data.path));
        loader.use(parsingMiddleware);
        loader.load((loader, resources) => resolve(resources));
    });
}


function splitImageSprite(data, img) {
    const name = data.name,
        width = data.width,
        height = data.height,
        offset = data.offset;
    const cellWidth = (img.naturalWidth - ((width - 1) * offset)) / width,
        cellHeight = (img.naturalHeight - ((height - 1) * offset)) / height;

    const frames = [];
    for (var i = 0; i < width; i++) {
        frames.push([]);
        for (var j = 0; j < height; j++) {

            const canvas = createFrame(img, j, i, offset, cellWidth, cellHeight);
            // logImage(canvas);
            let texture = new BaseTexture(canvas);
            BaseTexture.addToCache(texture, `${name}_${j}_${i}`);
            Texture.addToCache(new Texture(texture), `${name}_${j}_${i}`);
        }
    }
}

function createFrame(img, x, y, offset, width, height) {

    const canvas = document.createElement('canvas');
    canvas.width = CELL_SIZE.width;
    canvas.height = CELL_SIZE.height;
    const context = canvas.getContext('2d');
    // context.fillStyle = 'black';
    // context.fillRect(0, 0, width, height);
    context.drawImage(img, x * offset + x * width, y * offset + y * height, width, height, 0, 0, CELL_SIZE.width, CELL_SIZE.height);
    return canvas;
}


export {
    CELL_SIZE,
    loadFrames,
    SPRITES,
    SPRITES_DATA,
    getDirectionRotation
};
