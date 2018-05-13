'use strict';

const Symbols = {
    id: Symbol('id'),
    name: Symbol('name')
};

export default class User {
    constructor(app, id, name) {
        this.app = app;
        this[Symbols.id] = String(id);
        this[Symbols.name] = name;
    }

    get id() {
        return this[Symbols.id];
    }
    get name() {
        return this[Symbols.name];
    }

    /**
     * Überpüft ob User identisch sind.
     * @param  {User} user
     * @return {Boolean}
     */
    is(user) {
        if (typeof user === 'object') {
            return user && user.id === this.id;
        } else {
            return user === this.id;
        }

    }

}
