'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

/**
 * Abstract Class Module
 */
const Module = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(TYPES.MODULE);
        this._ready = false;
        this._module = null;
    }
    setupModule(app) {
        if (!this._ready) {
            this._module = new(this._module)(app, this);
            this._ready = true;
            this.trigger('module.ready', this._module, this);
        }
    }
    /**
     * Unit Module
     * @param {Class} module
     */
    setModule(module) {
        this._module = module;
    }

    get ready() {
        return this._ready;
    }

    get module() {
        return this._module;
    }
};
TYPES.MODULE = 'module';
CLASSES[TYPES.MODULE] = Module;
export default Module;
