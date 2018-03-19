'use strict';

import Unit from '../../../base/Unit';

import {
    ACTIONS as ACTION_TYPES
} from '../../../types';

import {
    getPositionsAroundPositionCircle
} from '../../../utils/matrix';

/**
 * Abstract Class Module
 * @class Spawn
 */
export default Abstract => class extends Abstract {

    constructor(app, unit) {
        super(app, unit);
        this._spawnActive = false;
        this._spawnRadius = 3;
        this._spawnUnitClass = Unit;
        this._spawnDuration = 2500;
        this._spawnWaitDuration = 10000;
    }

    /*
     * Functions
     */

    getRandomSpawnPosition(random = Math.random) {
        const positions = this.getFreePositionAroundPosition();
        if (positions.length) {
            return positions[Math.round(random() * (positions.length - 1))];
        } else {
            return null;
        }
    }

    getFreePositionAroundPosition() {
        return getPositionsAroundPositionCircle(this.unit.position, this._spawnRadius, true).reduce((result, position) => {
            if (this.app.map.getUnitsByCell(position.x, position.y).length < 1) {
                result.push(position);
            }
            return result;
        }, []);
    }

    /**
     * Aktiviert das Spawn.
     */
    startSpawn() {
        if (!this._spawnActive) {
            this._spawnActive = true;
            this.spawn();
        }
    }

    /**
     * Deaktiviert das Spawn, tritt beim letzten Spawn ein.
     */
    stopSpawn() {
        this._spawnActive = false;
    }

    /**
     * Spawnt eine neue Unit an eine zufällige Position um die Unit herum.
     * @return {[type]} [description]
     */
    spawn() {
        const position = this.getRandomSpawnPosition();
        let result = Promise.resolve();
        if (this._spawnActive) {
            if (position) {
                result = this.app.unitActions.add({
                    type: ACTION_TYPES.SPAWN,
                    unit: this.unit,
                    startArgs: [this._spawnDuration]
                }).then(() => {
                    const unit = new(this._spawnUnitClass)();
                    unit.position.setLocal(position);
                    this.app.map.units.add(unit);
                });
            } else {
                result = this.app.unitActions.add({
                    type: ACTION_TYPES.WAIT,
                    unit: this.unit,
                    startArgs: [this._spawnWaitDuration]
                });
            }
            result = result.then(() => {
                if (this._spawnActive) {
                    return this.spawn();
                }
            });
        }

        return result.catch(err => {
            console.error(err);
            throw err;
        });

    }

    /*
     * Properties
     */

    get spawnActive() {
        return this._spawnActive;
    }
    get spawnRadius() {
        return this._spawnRadius;
    }
    set spawnRadius(value) {
        this._spawnRadius = value;
    }
    get spawnDuration() {
        return this._spawnDuration;
    }
    set spawnDuration(value) {
        this._spawnDuration = value;
    }
    get spawnWaitDuration() {
        return this._spawnWaitDuration;
    }
    set spawnWaitDuration(value) {
        this._spawnWaitDuration = value;
    }
    get spawnUnitClass() {
        return this._spawnUnitClass;
    }
    set spawnUnitClass(value) {
        this._spawnUnitClass = value;
    }

};
