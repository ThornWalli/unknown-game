'use strict';

import Dialog from '../Dialog';
import {
    getUrl,
    getGETValue
} from '../../../game/utils/url';
export default Dialog.extend({

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {

        }
    }),

    events: Object.assign(Dialog.prototype.events, {
        'change [data-hook="testSelect"]': onChangeTest,
        'change [data-hook="mapSelect"]': onChangeMap
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
        this.queryByHook('testSelect').value = getGETValue('test');
        this.queryByHook('mapSelect').value = getGETValue('map-uri');
    }
});

function onChangeTest(e) {
    document.location.href = getUrl({
        'test': e.target.value
    });
}

function onChangeMap(e) {
    document.location.href = getUrl({
        'map-uri': e.target.value
    });
}
