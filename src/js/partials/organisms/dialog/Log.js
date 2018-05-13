'use strict';

import Dialog from '../Dialog';

export default Dialog.extend({

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {}
    }),

    events: Object.assign(Dialog.prototype.events, {}),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
    }
});
