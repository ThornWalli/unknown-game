'use strict';

import UrlParse from 'url-parse';

function getCurrentUrl() {
    return document.location.href;
}

function parseUrl(url) {
    return new UrlParse(url, true);
}

function getGETValue(name) {
    const url = parseUrl(getCurrentUrl());
    return url.query[name];
}

function getUrl(data = {}, url = null) {
    url = parseUrl(url || getCurrentUrl());
    url.query = Object.assign(url.query, data);
    return url.toString();
}

export {
    getCurrentUrl,
    parseUrl,
    getGETValue,
    getUrl
};
