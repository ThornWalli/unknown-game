'use strict';

function getFromXPath(path, data) {
    let name;
    while (path.length) {
        name = path.shift();
        if (name in data) {
            data = data[name];
        }
    }
    return data;
}

function getFlatList(items, result = []) {
    return Object.values(items).reduce((result, item) => {
        if (typeof item === 'object') {
            getFlatList(item, result);
        } else {
            result.push(item);
        }
        return result;
    }, result);
}


export {
    getFromXPath,
    getFlatList
};
