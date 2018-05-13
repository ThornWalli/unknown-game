'use strict';

import Unit from '../Unit';
import Abstract_ItemStorage from './abstract/ItemStorage';

export default class Greenhouse extends Abstract_ItemStorage(Unit) {
    constructor(app, unit) {
        super(app, unit);
    }
}
