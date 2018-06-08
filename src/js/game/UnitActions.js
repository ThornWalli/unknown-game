'use strict';

import Collection from './base/Collection';
import Events from './base/Events';

import Move from './base/action/Move';
import Transfer from './base/action/Transfer';
import Park from './base/action/Park';
import Spawn from './base/action/Spawn';
import Wait from './base/action/Wait';

import {
    ticker
} from './base/Ticker';

import SyncPromise from 'sync-p/extra';

import {
    UNITS as UNIT_TYPES
} from './types';

/**
 * Verwaltet die Aktionen der einzelnen Units.
 */
class UnitActions extends Events {
    constructor(app) {
        super();
        this._app = app;
        this._actionsByUnits = new Map();
        this._activeActions = new Collection();
    }

    add(options) {
        if (isActionUnit(options.unit)) {

            options = Object.assign({
                type: null,
                unit: null,
                /**
                 * Legt eine Funktion fest, die vor dem Start aufgerufen wird.
                 * Es können die Start-Argumente überarbeitet werden.
                 * Wenn `false` zurückgegeben wird, beendet sich die Action vor dem Start.
                 * @required
                 * @type {Function}
                 * @return {SyncPromise}
                 */
                beforeStart: null,
                /**
                 * Legt die start Argumente für den Start aufruf fest.
                 * @required
                 * @type {Array}
                 */
                startArgs: []

            }, options);

            return new SyncPromise(resolve => {
                const unit = options.unit;
                let action;
                if (typeof options.type === 'string') {
                    action = new(getAction(options.type))(unit, resolve);
                } else {
                    action = new options.type(unit, resolve);
                }
                const callback = () => {

                    action.unit.setAction(action);

                    let start;

                    if (options.beforeStart) {
                        start = options.beforeStart(options.startArgs);
                    } else {
                        start = SyncPromise.resolve(options.startArgs);
                    }

                    start.then(startArgs => {
                        if (!startArgs) {
                            // Action wird vor dem Start beendet.
                            stopAction.bind(this)(action);
                        } else {
                            action
                                .on('start', onActionStart, this)
                                .on('stop', onActionStop, this)
                                .on('complete', onActionComplete, this);
                            action.unit.activeAction.start.apply(action.unit.activeAction, startArgs);
                        }
                    }).catch(err => {
                        console.error(err);
                        throw err;
                    });
                };

                if (action.unit.activeAction) {
                    if (!this._actionsByUnits.has(unit.id)) {
                        this._actionsByUnits.set(unit.id, []);
                    }
                    this._actionsByUnits.get(unit.id).push(callback);
                } else {
                    callback();
                }

            }).catch(err => {
                console.error(err);
                throw err;
            });
        }
    }

    log(text) {
        this._app.logger.log('action', 'Action:' + text);
    }

    clearActionsByUnit(unit) {
        this._actionsByUnits.set(unit.id, []);
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

function stopAction(action) {
    // console.log('stopAction', action);
    action.unit.lastAction = ticker.now();
    action.callback(action);
    this._activeActions.remove(action);
    action.unit.setAction(null);
}

function onActionStart(action) {
    // console.log('UnitActions', 'Action Begin');
    this._activeActions.add(action);
}

function onActionStop(action) {
    // console.log('UnitActions', 'Action Begin');
    action.unit.lastAction = ticker.now();
    this._activeActions.remove(action);
    getNextAction.bind(this)(action.unit);
}

function onActionComplete(action) {
    // console.log('UnitActions', 'Action Complete');
    action.unit.lastAction = ticker.now();
    action.callback(action);
    this._activeActions.remove(action);
    getNextAction.bind(this)(action.unit);
}

function getNextAction(unit) {
    const id = unit.id;
    if (this._actionsByUnits.has(id) && this._actionsByUnits.get(id).length) {
        const callback = this._actionsByUnits.get(id).shift();
        callback();
    }
}

function isActionUnit(unit) {
    return unit.isType(UNIT_TYPES.ACTION);
}


const actions = {
    move: Move,
    transfer: Transfer,
    park: Park,
    spawn: Spawn,
    wait: Wait
};

function getAction(type) {
    return actions[type];
}

export {
    UnitActions as
    default, getAction
};
