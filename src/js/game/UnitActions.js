'use strict';

import Collection from './base/Collection';
import Events from './base/Events';

import Move from './base/action/Move';
import Transfer from './base/action/Transfer';
import Park from './base/action/Park';

import SyncPromise from 'sync-p';

import {
    TYPES as UNIT_TYPES
} from './utils/unit';

/**
 * Verwaltet die Aktionen der einzelnen Units.
 */
class UnitActions extends Events {
    constructor(app) {
        super();
        this._app = app;
        this._actionsByUnits = new Map();
        this._activeActions = new Collection();
        // this._activeActions.on('add', onAddAction, this);

        // this._app.timer.on('tick', () => {
        //     this._activeActions.forEach(action => {
        //         action.tick();
        //     });
        // });
    }

    add(unit, type) {
        console.log('UnitActions Start', type, unit);
        if (isActionUnit(unit)) {
            let args = Array.from(arguments);
            args = args.splice(2, args.length);
            return new SyncPromise(resolve => {
                let action;
                if (typeof type === 'string') {
                    action = new(getAction(type))(unit, resolve);
                } else {
                    action = new type(unit, resolve);
                }
                action.unit.once('setAction', () => {
                    action
                        .on('stop', onActionStop, this)
                        .on('start', onActionStart, this)
                        .on('complete', onActionComplete, this);
                }, this);
                if (!action.unit.setAction(action)) {
                    if (!this._actionsByUnits.has(unit.id)) {
                        this._actionsByUnits.set(unit.id, []);
                    }
                    this._actionsByUnits.get(unit.id).push(action);
                } else {
                    action.unit.activeAction.start.apply(action.unit.activeAction, args);
                }

            });
        }
    }
    log(text) {
        this._app.logger.log('action', 'Action:' + text);
    }

    /*
     * Properties
     */

    get actions() {
        return this._actions;
    }

    get units() {
        return this._units;
    }

    get activeActions() {
        return this._activeActions;
    }
}


function onActionStart(action) {
    // console.log('UnitActions', 'Action Begin');
    this._activeActions.add(action);
}

function onActionComplete(action) {
    // console.log('UnitActions', 'Action Complete');
    action.callback(action);
    this._activeActions.remove(action);
    getNextAction.bind(this)(action.unit);
}

function onActionStop(action) {
    // console.log('UnitActions', 'Action Stop');
    this._activeActions.remove(action);
    getNextAction.bind(this)(action.unit);
}

function getNextAction(unit) {
    const id = unit.id;
    if (this._actionsByUnits.has(id)) {
        const action = this._actionsByUnits.get(id).shift();
        unit.setAction(action);
    }
}

function isActionUnit(unit) {
    return unit.isType(UNIT_TYPES.ACTION);
}


const actions = {
    move: Move,
    transfer: Transfer,
    park: Park
};

function getAction(type) {
    return actions[type];
}

export {
    UnitActions as
    default, getAction
};
