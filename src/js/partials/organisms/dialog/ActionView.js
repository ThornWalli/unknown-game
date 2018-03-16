'use strict';

import Dialog from '../Dialog';

export default Dialog.extend({


    pathLength: 0,

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {
            unit: {
                type: 'object',
                required: false
            },
            action: {
                type: 'object',
                required: false
            },

            tabContainer: {
                type: 'object',
                required: false
            }
        }
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);



        // Transfer
        this.elements.transferFrom = this.queryByHook('actionViewTransferFrom');
        this.elements.transferInfo = this.queryByHook('actionViewTransferInfo');
        this.elements.transferTo = this.queryByHook('actionViewTransferTo');

        // Move
        this.elements.moveFrom = this.queryByHook('actionViewMoveFrom');
        this.elements.moveTo = this.queryByHook('actionViewMoveTo');
        this.elements.moveProgress = this.queryByHook('actionViewMoveProgress');

        this.targetModel.on('change:app', (model, app) => {
            app.ready.then(() => {
                app.unitSelect.on('select', unit => {
                    if (this.model.unit) {
                        unregister.bind(this)(this.model.unit);
                    }
                    register.bind(this)(unit);
                });
                if (app.unitSelect.selectedUnits.length > 0) {
                    register.bind(this)(app.unitSelect.selectedUnits[0]);
                }
            });
        });

    }

});


function register(unit) {
    this.model.unit = unit;
    unit.on('setAction', onSetAction, this);
    if (unit.activeAction) {
        onSetAction.bind(this)(unit.activeAction);
    }
}

function unregister(unit) {
    unit.off(null, null, this);
}

function onSetAction(action) {
    if (this.model.action) {
        this.model.action.off(null, null, this);
    }
    this.model.action = action;

    setupAction.bind(this)(action);

    this.model.tabContainer.openByName(action.type);

}



function setupAction(action) {
    if (action.type === 'transfer') {
        action.on('transferring', renderTransferTransferring, this);
        if (action.started) {
            renderMoveStart.bind(this)(action);
        }
    } else if (action.type === 'move') {
        action.on('start', () => renderMoveStart, this);
        if (action.started) {
            renderMoveStart.bind(this)(action);
        }
        action.on('moving', renderMoveMoving, this);
    }
}


function renderTransferTransferring(action, value) {

    this.elements.transferInfo.innerHTML = `${Math.round(value * 100)}%`;

    let fromEl, toEl;
    if (action.transferDirection) {
        fromEl = this.elements.transformTo;
        toEl = this.elements.transferFrom;
    } else {
        fromEl = this.elements.transferFrom;
        toEl = this.elements.transformTo;
    }

    if (action.transferDirection) {
        this.elements.transferFrom.innerHTML = `${action.transferType}: ${Math.round((action.unit.module.storageItems[action.transferType] || 0) + action.transferValue * value)}<br />`;
        this.elements.transferTo.innerHTML = `${action.transferType}: ${Math.round((action._targetUnit.module.storageItems[action.transferType] || 0) - action.transferValue * value)}<br />`;
    } else {
        this.elements.transferFrom.innerHTML = `${action.transferType}: ${Math.round((action.unit.module.storageItems[action.transferType] || 0) - action.transferValue * value)}<br />`;
        this.elements.transferTo.innerHTML = `${action.transferType}: ${Math.round((action._targetUnit.module.storageItems[action.transferType] || 0) + action.transferValue * value)}<br />`;
    }
}

function renderMoveStart(action) {
    this.elements.moveProgress.innerHTML = '0%';
    const startPosition = action.moveData.startPosition;
    const endPosition = action.moveData.endPosition;

    this.elements.moveFrom.innerHTML = `${startPosition.x} / ${startPosition.y}`;
    this.elements.moveTo.innerHTML = `${endPosition.x} / ${endPosition.y}`;
}


function renderMoveMoving(action, value) {

    const length = action.moveData.length - 1,
        pathLength = action.moveData.path.length;

    let val = Math.max((1 - pathLength / length) + value * (1 / length) - (1 / length), 0);
    this.elements.moveProgress.innerHTML = `${Math.round(val * 100 )}%`;
}
