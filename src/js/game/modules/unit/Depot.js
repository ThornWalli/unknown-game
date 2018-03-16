'use strict';

import Unit from '../Unit';
import UnitStorage from './abstract/UnitStorage';


export default class Depot extends UnitStorage(Unit) {
    constructor(app, unit) {
        super(app, unit);


    }
}
