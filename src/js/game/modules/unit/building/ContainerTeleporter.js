'use strict';

import {
    ITEMS
} from '../../../types';

import Teleporter from '../Teleporter';

export default class ContainerTeleporter extends Teleporter {
    constructor(app, unit) {
        super(app, unit);
        this.teleporterRequestedItems = [ITEMS.RESOURCE.WATER];
    }

}
