"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';
import viewport from 'gp-module-viewport';

export default Controller.extend({


    modelConstructor: DomModel.extend({
        session: {}
    }),

    bindings: {},

    events: {},


    initialize() {
        Controller.prototype.initialize.apply(this, arguments);
        this.elements = {};
        viewport.on(viewport.EVENT_TYPES.INIT, this.onViewportInit.bind(this));
        if (this.targetModel) {
            this.targetModel.on('change:app', (model, app) => app.ready.then(this.onAppReady.bind(this)));
        }
    },

    // Functions

    onAppReady() {},

    // Events

    onViewportInit() {
        viewport.on(viewport.EVENT_TYPES.RESIZE, this.onViewportResize.bind(this));
        this.onViewportResize.bind(this)();
    },

    onViewportResize() {
        if (this.model.isHorizontalCenterPositioning || this.model.isVerticalCenterPositioning) {
            this.setPosition();
        }
    }
});
