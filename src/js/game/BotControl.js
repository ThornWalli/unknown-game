'use strict';

import {
    TYPE as TYPE_BOT
} from './base/unit/Bot';

/**
 * Verwaltet die Bots.
 */
export default class BotControl {
    constructor(app) {
        this._app = app;

        this._units = this._app.map.units.createFilteredCollection((unit) => {
            if (isBot(unit)) {
                return unit;
            }
        });

        // setTimeout(() => {
        //     this._units.items.forEach(unit => {
        //         moveUnit.bind(this)(unit, 0, -2).then(() => {
        //             return test_botMoveLoop.bind(this)(unit);
        //         });
        //     });
        // }, 1000);

    }

    /*
     * Properties
     */

    get units() {
        return this._units;
    }
}


// function test_botMoveLoop(unit) {
//     return moveUnit.bind(this)(unit, 0, 4).then(() => {
//         return moveUnit.bind(this)(unit, 0, -4).then(() => {
//             return test_botMoveLoop.bind(this)(unit);
//         });
//     });
// }


function isBot(unit) {
    return unit.isType(TYPE_BOT);
}


// function moveUnit(unit, x, y) {
//
//     const position = unit.position.addValues(x, y);
//
//     // get moveData
//     // set moveData for move unit
//     // if (unit.activeAction && unit.activeAction.type === 'move') {
//     //     unit.activeAction.stop();
//     // }
//
//     return this._app.map.getMoveData(unit, position).then(moveData => {
//         if (moveData.path.length > 0) {
//             return this._app.unitActions.add(unit, 'move', moveData);
//         } else {
//             console.log('Position ist belegt');
//         }
//     });
// }
