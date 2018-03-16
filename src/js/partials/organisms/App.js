"use strict";

import {
    touchEvent
} from '../../utils/dom';

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';
import viewport from 'gp-module-viewport';

import {
    App,
    Size,
    InputKeyEvent,
    InputPointerEvent,
    Position
} from '../../game/App';

class Events_Dom {
    static onContextMenu(event) {
        event.preventDefault();
    }
    static onChangeTypeSelect(event) {
        this.model.type = event.target.value;
    }

    static onPointerDown(event) {
        touchEvent(this, event);
        event.preventDefault();
        this.model.app.onPointerDown(this.getPointerEvent(event));
        $(document)
            .on(`mouseup.${this.cid} touchend.${this.cid}`, Events_Dom.onPointerUp.bind(this))
            .on(`mousemove.${this.cid} touchmove.${this.cid}`, Events_Dom.onPointerMove.bind(this));
    }
    static onPointerUp(event) {
        touchEvent(this, event);
        this.model.app.onPointerUp(this.getPointerEvent(event));
        $(document)
            .off(`mouseup.${this.cid} touchend.${this.cid}`)
            .off(`mousemove.${this.cid} touchmove.${this.cid}`);
    }
    static onPointerMove(event) {
        touchEvent(this, event);
        this.model.app.onPointerMove(this.getPointerEvent(event));
    }

    static onKeyDown(event) {
        this.model.app.onKeyDown(this.getKeyEvent(event));
    }
    static onKeyUp(event) {
        this.model.app.onKeyUp(this.getKeyEvent(event));
    }

}

export default Controller.extend({

    modelConstructor: DomModel.extend({

        session: {
            app: {
                type: 'object',
                required: false
            },
            offset: {
                type: 'object',
                required: true,
                default () {
                    return new Position();
                }
            }
        }

    }),

    events: {
        'contextmenu [data-hook="appContainer"]': Events_Dom.onContextMenu,
        'touchstart [data-hook="appContainer"]': Events_Dom.onPointerDown,
        'mousedown [data-hook="appContainer"]': Events_Dom.onPointerDown,
    },

    bindings: {},

    initialize() {
        Controller.prototype.initialize.apply(this, arguments);
        this.elements = {
            container: this.queryByHook('appContainer')
        };
        viewport.on(viewport.EVENT_TYPES.INIT, onViewportInit.bind(this));

        $(document)
            .on(`keydown.${this.cid}`, Events_Dom.onKeyDown.bind(this))
            .on(`keyup.${this.cid}`, Events_Dom.onKeyUp.bind(this));

    },
    getKeyEvent(event) {
        event = new InputKeyEvent(event);
        return event;
    },
    getPointerEvent(event) {
        event = new InputPointerEvent(event);
        event.x -= this.model.offset.x;
        event.y -= this.model.offset.y;
        return event;
    },

    getOptions() {
        return {
            loadModules: true,
            debugGridMode: false,
            dimension: new Size(640, 480)
        };
    },

    getApp(){
        return App;
    }


});

function onRefreshApp() {
    console.log('App Offset:', this.model.offset);
    this.model.offset.setValuesLocal(parseInt((this.el.offsetWidth - this.elements.container.offsetWidth) / 2), parseInt((this.el.offsetHeight - this.elements.container.offsetHeight) / 2));
    this.elements.container.style.left = `${this.model.offset.x}px`;
    this.elements.container.style.top = `${this.model.offset.y}px`;
}

function onViewportInit() {
    this.model.app = new (this.getApp())(this.elements.container, this.getOptions());
    this.model.app.on('refresh', onRefreshApp, this);
    viewport.on(viewport.EVENT_TYPES.RESIZE, onViewportResize.bind(this));
    global.requestAnimationFrame(onViewportResize.bind(this));
}

function onViewportResize() {
    this.model.app.refresh();
}
