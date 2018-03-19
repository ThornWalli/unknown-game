'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

/**
 * Abstract Class Module
 */
const Module = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.MODULE);
        this._ready = false;
        this._module = null;
    }
    /**
     * Tritt ein wenn Module bereit ist.
     * @param {game.base.Module} module
     */
    onModuleReady() {}
    setupModule(app) {
        if (!this._ready) {
            this._module = new(this._module)(app, this);
            this._ready = true;
            this.onModuleReady(this._module);
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

    /**
     * @return {Boolean}
     */
    get ready() {
        return this._ready;
    }

    /**
     * @return {Object}
     */
    get module() {
        return this._module;
    }
};
UNIT_TYPES.MODULE = 'module';
UNIT_CLASSES[UNIT_TYPES.MODULE] = Module;
export default Module;
