'use strict';

import Dialog from '../Dialog';

import {
    default as Template,
    parse
} from '../../../base/Template';
import detailInfoTmpl from '../../../../tmpl/partials/organisms/dialog/detail-info.hbs';

export default Dialog.extend({

    detailInfoTmpl: new Template(detailInfoTmpl),

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {}
    }),

    events: Object.assign(Dialog.prototype.events, {
        'click [data-dialog="detail-info"]': onClickOpenDetailInfo
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
    }

});


function onClickOpenDetailInfo() {
    if (!this.targetModel.dialogs.models.find(dialog => dialog.name === 'detail-info')) {
        document.body.appendChild(this.detailInfoTmpl.toFragment({
            target: this.el.getAttribute('data-target'),
            isStatic: true,
            isOpen: true
        }));
        parse(document.body.lastElementChild);
    }
}
