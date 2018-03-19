'use strict';

import {
    UNIT_CLASSES,
    UNITS as UNIT_TYPES
} from '../../types';

import Module_Source from '../../modules/unit/Source';

import Unit from '../Unit';

import Abstract_Action from './abstract/Action';
import Abstract_Module from './abstract/Module';
import Abstract_Spawn from './abstract/Spawn';
import Abstract_Sprite from './abstract/Sprite';

class Source extends Abstract_Sprite(Abstract_Spawn(Abstract_Module(Abstract_Action(Unit)))) {
    constructor() {
        super();
        this.setType(UNIT_TYPES.SOURCE.DEFAULT);
        this.setModule(Module_Source);
        this.selectable = true;
        this.walkable = false;
    }
}
UNIT_TYPES.SOURCE = {
    DEFAULT: 'source.default'
};
UNIT_CLASSES[UNIT_TYPES.SOURCE.DEFAULT] = Source;

export default Source;
