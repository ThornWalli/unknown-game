'use strict';

import Unit from '../Unit';

export default Unit.extend({

    modelConstructor: Unit.prototype.modelConstructor.extend({
        session: {}
    }),

    events: Object.assign({}, Unit.prototype.events, {}),

    initialize() {
        Unit.prototype.initialize.apply(this, arguments);
        this.model.tabs.push(['general']);
    },


});
