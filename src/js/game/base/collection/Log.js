'use strict';

import Collection from '../Collection';

export default class LogCollection extends Collection {

    getByType(type) {
        return this.filter(log => {
            if (log.type === type) {
                return type;
            }
        });
    }

    /*
     * Properties
     */

    get class() {
        return LogCollection;
    }
}
