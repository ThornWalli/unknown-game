'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../../types';

/**
 * Abstract Class Action
 */
const Action = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(UNIT_TYPES.ACTION);
        this._activeAction = null;

        this._lastAction = 0;
        this._actionHistory = [];

    }

    /*
     * Functions
     */

    setAction(action) {
        if (!action) {
            this._activeAction = null;
        } else if (!this._activeAction) {
            this._actionHistory.push(Object.assign({}, action));
            this._activeAction = action;
            this._activeAction.on('stop', () => {
                this._activeAction = null;
            }).on('complete', () => {
                this._activeAction = null;
                this.onActionComplete();
            });
            this.trigger('setAction', this._activeAction, this);
            return true;
        } else {
            return false;
        }
    }

    onActionComplete() {

    }

    /**
     * Properties
     */
    get activeAction() {
        return this._activeAction;
    }

    /**
     * get last action end timestamp
     * @return {Number}
     */
    get lastAction() {
        return this._lastAction;
    }

    /**
     * Sets last action end timestamp
     */
    set lastAction(value) {
        this._lastAction = value;
    }



};
UNIT_TYPES.ACTION = 'action';
UNIT_CLASSES[UNIT_TYPES.ACTION] = Action;

export default Action;
