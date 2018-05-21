"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';
import viewport from 'gp-module-viewport';

export default Controller.extend({

    modelConstructor: DomModel.extend({

        session: {
            name: {
                type: 'string',
                required: false
            },
            isHorizontalCenterPositioning: {
                type: 'boolean',
                required: true
            },
            isVerticalCenterPositioning: {
                type: 'boolean',
                required: true
            },
            tabContainer: {
                type: 'object',
                required: false
            },
            isReady: {
                type: 'boolean',
                required: true
            },
            isStatic: {
                type: 'boolean',
                required: true
            },
            isOpen: {
                type: 'boolean',
                required: true
            }
        },

        close() {
            this.isOpen = false;
        }

    }),

    events: {
        'click [data-hook="dialogClose"]': 'onClickClose'
    },
    bindings: {
        'model.isReady': {
            type: 'booleanClass',
            name: 'js--is-ready'
        },
        'model.isStatic': {
            type: 'booleanClass',
            name: 'js--is-static'
        },
        'model.isOpen': {
            type: 'booleanClass',
            name: 'js--is-open'
        }
    },

    initialize() {
        Controller.prototype.initialize.apply(this, arguments);
        this.model.once('change:isReady', () => {
            this.model.on('change:isOpen', onChangeIsOpen, this);
            if (this.model.isOpen) {
                onChangeIsOpen.bind(this)(this.model, this.model.isOpen);
            }
        }, this);


        this.elements = {};

        this.model.isHorizontalCenterPositioning = this.el.classList.contains('dialog-position--horizontal-center');
        this.model.isVerticalCenterPositioning = this.el.classList.contains('dialog-position--vertical-center');

        viewport.on(viewport.EVENT_TYPES.INIT, this.onViewportInit.bind(this));
        if (this.targetModel) {
            this.targetModel.dialogs.add(this.model);
            this.targetModel.getApp(app => app.ready.then(this.onAppReady.bind(this)));
        }



        $(`[data-dialog="${this.model.name}"]`).on('click', this.onClickOpenButton.bind(this));

    },

    destroy() {
        $(`[data-dialog="${this.model.name}"]`).off('click');
        Controller.prototype.destroy.apply(this, arguments);
    },

    // Functions

    setPosition(cb) {
        this.el.style.left = null;
        this.el.style.top = null;
        this.el.style.transform = null;
        if (!this.anim) {
            this.anim = setTimeout(() => {
                global.requestAnimationFrame(() => {
                    var position = this.el.getBoundingClientRect();
                    global.requestAnimationFrame(() => {
                        if (this.model.isStatic || this.model.isHorizontalCenterPositioning) {
                            this.el.style.left = `${parseInt(position.left)}px`;
                        }
                        if (this.model.isStatic || this.model.isVerticalCenterPositioning) {
                            this.el.style.top = `${parseInt(position.top)}px`;
                        }
                        this.el.style.transform = `none`;
                        this.anim = null;
                        if (typeof cb === 'function') {
                            cb();
                        }
                    });
                });
            }, 500);
        }
    },

    // Events

    onClickOpenButton() {
        this.model.isOpen = true;
    },

    onViewportInit() {
        viewport.on(viewport.EVENT_TYPES.RESIZE, this.onViewportResize.bind(this));
        this.onViewportResize.bind(this)(() => {
            this.model.isReady = true;
        });
    },

    onViewportResize(cb) {
        if (this.model.isStatic || this.model.isHorizontalCenterPositioning || this.model.isVerticalCenterPositioning) {
            this.setPosition(cb);
        } else if (typeof cb === 'function') {
            cb();
        }
    },

    /**
     * @override
     */
    onAppReady() {},

    /**
     * @override
     */
    onOpened() {},

    /**
     * @override
     */
    onClosed() {},

    onClickClose() {
        this.model.close();
    }



});

function onChangeIsOpen(model, isOpen) {
    if (model.isStatic) {
        if (isOpen) {
            document.body.classList.add('js--static-dialog-open');
            this.onOpened();
        } else {
            document.body.classList.remove('js--static-dialog-open');
            this.onClosed();
        }
    }
}
