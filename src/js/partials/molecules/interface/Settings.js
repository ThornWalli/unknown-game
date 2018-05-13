'use strict';
import {
    ticker
} from '../../../game/base/Ticker';
import Interface from '../Interface';
import {
    getUrl,
    getGETValue
} from '../../../game/utils/url';
export default Interface.extend({

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {

        }
    }),

    events: Object.assign({}, Interface.prototype.events, {
        // 'change [data-hook="testSelect"]': onChangeTest,
        'change [data-hook="mapSelect"]': onChangeMap,
        // 'change [data-hook="speedSelect"]': onChangeSpeed,
        'click [data-hook="timewarpButton"]': onClickTimewarp
    }),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
        // this.queryByHook('testSelect').value = getGETValue('test');
        this.queryByHook('mapSelect').value = getGETValue('map-uri');
    }
});

// function onChangeTest(e) {
//     document.location.href = getUrl({
//         'test': e.target.value
//     });
// }

function onChangeMap(e) {
    document.location.href = getUrl({
        'map-uri': e.target.value
    });
}

// function onChangeSpeed(e) {
//     console.log(e);
// }

function onClickTimewarp() {
    console.log(ticker);
    ticker.skip(1000 * 60);
}
