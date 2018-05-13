'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_CLASSES
} from '../../../types';

import Sprite from '../Sprite';
import SPRITE_BLUEPRINTS from '../../../types/spriteBlueprints';

class Resource extends Sprite {
    constructor(unit, spriteType = UNIT_TYPES.RESOURCE.DEFAULT) {
        super(unit, spriteType);
    }
    onModuleReady(module) {
        Sprite.prototype.onModuleReady.apply(this, arguments);
        if (SPRITE_BLUEPRINTS[this.unit.type].width > 1) {
            module.on('storage.value.transfer', (resource, type) => {
                const index = (SPRITE_BLUEPRINTS[this.unit.type].width - 1) - resource.getItemStorageItemValue(type) / (resource.maxItemStorageItemValue / (SPRITE_BLUEPRINTS[this.unit.type].width - 1));
                this.setFrame(index);
            }, this);
        }
    }
}

SPRITE_CLASSES[UNIT_TYPES.RESOURCE.DEFAULT] = Resource;
export default Resource;
