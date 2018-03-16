"use strict";

import Controller from 'gp-module-base/Controller';
import blockAdBlock from 'exports-loader?blockAdBlock!blockadblock';

export default Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        blockAdBlock.onDetected(function() {
            this.el.classList.add('js-active');
        }.bind(this));
    }
});
