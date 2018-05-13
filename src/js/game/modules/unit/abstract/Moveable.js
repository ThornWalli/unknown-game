'use strict';

import {
    ACTIONS as ACTION_TYPES
} from '../../../types';

/**
 * Abstract Class Module
 * @class Moveable
 */
export default Abstract => class extends Abstract {

    constructor(app, unit) {
        super(app, unit);
    }

    /*
     * Functions
     */

    onSelectSecondary(unit, selectedUnits, position) {
        return this.moveToPosition(position);
    }

    /**
     * Bewegt Unit zu angegebener Position.
     * @param  {game.base.Unit} unit
     * @param  {game.base.Position} position
     * @return {Promise}
     */
    moveToPosition(position) {

        const hasAction = this.unit.activeAction;
        if (hasAction) {
            console.log('STOP?');
            this.unit.activeAction.stop();
            this.app.unitActions.clearActionsByUnit(this.unit);
        }
        const action = this.app.unitActions.add({
            type: ACTION_TYPES.MOVE,
            unit: this.unit,
            startArgs: [],
            beforeStart: (startArgs) => {
                return this.app.map.getMoveData(this.unit, position).then(moveData => {
                    if (moveData.path.length > 0) {
                        startArgs.push(moveData);
                        return startArgs;
                    } else {
                        return false;
                    }
                });
            }
        });

        return action;
    }

    /*
     * Properties
     */


};
