"use strict";

import App from '../App';

import Game from '../../../game/app/Game';

export default App.extend({
    getOptions() {
        const options = App.prototype.getOptions.apply(this, arguments);
        return options;
    },

    getApp() {
        return Game;
    }

});
