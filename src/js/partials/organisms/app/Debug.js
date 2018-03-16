"use strict";

import App from '../App';

export default App.extend({

    getOptions() {
        const options = App.prototype.getOptions.apply(this, arguments);
        options.debugGridMode = true;
        return options;
    }

});
