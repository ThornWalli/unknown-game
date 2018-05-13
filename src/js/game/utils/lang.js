'use strict';

import {
    getFromXPath
} from '../utils';
import defaultLang from '../lang/default.json';

class Lang {
    constructor() {
        this.data = defaultLang;
    }

    get(path) {
        let value = getFromXPath(path.split('.'), this.data);
        if (typeof value === 'object') {
            return path;
        }
        return value;
    }

}


export default new Lang();
