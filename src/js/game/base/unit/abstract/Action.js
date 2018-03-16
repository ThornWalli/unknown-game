'use strict';

import {
    TYPES,
    CLASSES
} from '../../../utils/unit';

/**
 * Abstract Class Action
 */
const Action = Abstract => class extends Abstract {
    constructor() {
        super();
        this.setType(TYPES.ACTION);
        this._activeAction = null;
    }

    /*
     * Functions
     */

    setAction(action) {
        if (!this._activeAction) {
            this._activeAction = action;
            this._activeAction.on('stop', () => {
                this._activeAction = null;
            }).on('complete', () => {
                this._activeAction = null;
            });
            this.trigger('setAction', this._activeAction, this);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Properties
     */
    get activeAction() {
        return this._activeAction;
    }
};
TYPES.ACTION = 'action';
CLASSES[TYPES.ACTION] = Action;
export default Action;
