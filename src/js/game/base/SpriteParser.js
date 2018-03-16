'use strict';

var logImage = require('console-image');

class ImageQueu {
    constructor(size = 6) {
        this._imgs = [];
        this._queu = [];
        for (var i = 0; i < size; i++) {
            const img = document.createElement('img');
            this._imgs.push(img);
        }
    }

    load(url) {
        return new Promise(resolve => {
            this._queu.push({
                url,
                cb: resolve
            });
            load.bind(this)();
        });
    }
}


var imageQueu = new ImageQueu();

export default class SpriteParser {
    constructor() {

    }

    parse(url, width, height, offset = 0) {

        return imageQueu.load(url).then(splitImage(width, height, offset));


    }
}

function splitImage(width, height, offset) {
    return (img) => {
        const cellWidth = (img.naturalWidth - ((width - 1) * offset)) / width;
        const cellHeight = (img.naturalHeight - ((height - 1) * offset)) / height;

        const frames = [];
        for (var i = 0; i < width; i++) {
            frames.push([]);
            for (var j = 0; j < height; j++) {

                const canvas = createFrame(img, j, i, offset, cellWidth, cellHeight);
                // logImage(dataUrl);
                logImage(canvas);
                console.log('j,i', j, i);
                frames[i].push(canvas);
            }
        }

        return frames;
    };
}

function createFrame(img, x, y, offset, width, height) {

const CELL_WIDTH = 20, CELL_HEIGHT = 20;

    const canvas = document.createElement('canvas');
    canvas.width = CELL_WIDTH;
    canvas.height = CELL_HEIGHT;
    const context = canvas.getContext('2d');
    // context.fillStyle = 'black';
    // context.fillRect(0, 0, width, height);
    context.drawImage(img, x * offset + x * width, y * offset + y * height, width, height, 0, 0, CELL_WIDTH, CELL_HEIGHT);
    return canvas;
}


function load() {
    if (this._imgs.length > 0) {
        const data = this._queu.pop();
        const img = this._imgs.pop();
        img.onload = () => {
            this._imgs.push(img);
            data.cb(img);
        };
        img.src = data.url;
    }
}
