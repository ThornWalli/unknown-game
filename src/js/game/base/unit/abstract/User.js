'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

/**
 * Abstract Class User
 */
const User = Abstract => class extends Abstract {
    constructor() {
        super();
        this._user = null;
        this.setType(UNIT_TYPES.USER);
    }

    /*
     * Properties
     */

    get user() {
        return this._user;
    }
    set user(user) {
        this._user = user;
    }
};
UNIT_TYPES.USER = 'user';
UNIT_CLASSES[UNIT_TYPES.USER] = User;
export default User;
