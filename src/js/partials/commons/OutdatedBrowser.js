"use strict";

import Controller from 'gp-module-base/Controller';
import 'outdated-browser/outdatedbrowser/outdatedbrowser.css';
import outdatedBrowser from 'exports-loader?outdatedBrowser!outdated-browser/outdatedbrowser/outdatedbrowser';

export default Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        global.animationFrame.addOnce(function() {            
            outdatedBrowser({
                bgColor: '#f25648',
                color: '#ffffff',
                lowerThan: 'IE9',
                languagePath: ''
            });
            // this.el.classList.remove('js-hidden');
        }.bind(this));
    }
});
