'use strict';

import Size from './base/Size';

import xhr from 'xhr';

class MapLoader {
    constructor() {}
    load(url) {
        return new Promise(resolve => {
            xhr({
                method: 'get',
                uri: url
            }, (err, resp, body) => {
                if (err) {
                    throw err;
                }
                const data = getDefaultMapData(JSON.parse(body));
                showInfo(data);
                resolve(data);
            });
        });
    }
}



function showInfo(data) {
    console.log([
        'MapLoader Info',
        `Matrix Size:\t${data.matrix.x} x ${data.matrix.y}`,
        `Units:\t\t${data.units.length}`
    ].join('\n'));
}

function getDefaultMapData(data = {}) {
    data = Object.assign({
        matrix: new Size(),
        units: []
    }, data);
    data.matrix = new Size(data.matrix);
    return data;
}

const mapLoader = new MapLoader();

export {
    mapLoader,
    MapLoader as
    default,
    getDefaultMapData
};
