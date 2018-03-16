"use strict";

import App from '../App';

import MapBuilder from '../../../game/app/MapBuilder';

export default App.extend({
    getOptions() {
        const options = App.prototype.getOptions.apply(this, arguments);
        options.loadModules = false;
        return options;
    },

    getApp() {
        return MapBuilder;
    }

});
