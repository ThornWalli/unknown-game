'use strict';

import Interface from '../Interface';

import Template from '../../../base/Template';
import itemTmpl from './tmpl/logItem.hbs';

import {
    timestampToTimeString
} from '../../../utils/date';

export default Interface.extend({

    itemTmpl: new Template(itemTmpl),

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {
            /**
             * Logger
             * @type {Logger}
             */
            logger: {
                type: 'object',
                required: false
            }
        }
    }),

    events: Object.assign({}, Interface.prototype.events, {}),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);

        this.elements.list = this.queryByHook('unitSelectionItems');

        if (this.targetModel) {
            if (this.targetModel.app) {
                onChangeTargetApp.bind(this)(this.targetModel, this.targetModel.app);
            } else {
                this.targetModel.once('change:app', onChangeTargetApp, this);
            }

        } else {
            throw new Error('TargetModel is undefined…');
        }
    },

    renderItems() {
        this.elements.list.innerHTML = '';
        this.model.logger.logs.forEach(log => this.renderItem(log));
    },

    renderItem(log) {
        this.elements.list.appendChild(this.itemTmpl.toFragment({
            time: timestampToTimeString(log.timestamp),
            type: log.type,
            text: log.text
        }));
        this.elements.list.parentElement.scrollTop = this.elements.list.parentElement.scrollHeight;
    }
});

function onChangeTargetApp(model, app) {
    app.ready.then(() => {
        this.model.logger = app.logger;
        this.model.logger.logs.on('add', onAddLog, this);
        this.renderItems();
    });
}


function onAddLog(log) {
    this.renderItem(log);
}
