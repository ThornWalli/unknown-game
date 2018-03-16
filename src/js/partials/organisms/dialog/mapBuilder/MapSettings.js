'use strict';

import Size from '../../../../game/base/Size';
import Dialog from '../../Dialog';
import Position from '../../../../game/base/Position';
import PositionBounds from '../../../../game/base/PositionBounds';

import MapSettings from '../../../../game/components/MapSettings';

import serialize from 'form-serialize';

import FileSaver from 'file-saver';

export default Dialog.extend({

    modelConstructor: Dialog.prototype.modelConstructor.extend({
        session: {
            /**
             * Canvas Offset
             * @type {Position}
             */
            canvasBounds: {
                type: 'object',
                required: true,
                default () {
                    return new PositionBounds();
                }
            },
            /**
             * Selection position
             * @type {Position}
             */
            position: {
                type: 'object',
                required: true,
                default () {
                    return new Position();
                }
            },
            /**
             * MapSettings
             * @type {MapSettings}
             */
            mapSettings: {
                type: 'object',
                required: false
            }
        }
    }),

    events: Object.assign(Dialog.prototype.events, {
        'submit form': onSubmit,
        'click [data-hook="mapSettingsExportButton"]': onClickExport
    }),

    initialize() {
        Dialog.prototype.initialize.apply(this, arguments);
        this.elements.form = this.query('form');
        this.elements.importButton = this.queryByHook('mapSettingsImportButton');
        this.model.on('change:mapSettings', onChangeMapSettings, this);

        fileReaderSetup.bind(this)();
        this.elements.importButton.addEventListener('change', onChangeImport.bind(this));
    },

    onViewportInit() {
        if (this.targetModel) {
            if (this.targetModel.app) {
                onChangeTargeApp.bind(this)(this.targetModel, this.targetModel.app);
            } else {
                this.targetModel.once('change:app', onChangeTargeApp, this);
            }

        } else {
            throw new Error('TargetModel is undefined…');
        }
        Dialog.prototype.onViewportInit.apply(this, arguments);
    }

});


function fillForm(form, data) {
    data.forEach(field => {
        var el = form.querySelector(`[name="${field.name}"]`);
        el.value = field.value;
    });
}

function onChangeTargeApp(model, app) {
    app.ready.then(() => {
        this.model.mapSettings = new MapSettings(app);
    });
}

function onChangeMapSettings(model, mapSettings) {
    const matrixSize = mapSettings.getMatrixSize();
    fillForm(this.elements.form, [{
            name: 'sizeX',
            value: matrixSize.width
        },
        {
            name: 'sizeY',
            value: matrixSize.height
        }

    ]);
}

function onChangeImport() {
    this.fileReader.readAsText(this.elements.importButton.files.item(0), "UTF-8");
}

function onClickExport() {
    FileSaver.saveAs(new File([JSON.stringify(this.model.mapSettings.export())], "export-map.json", {
        type: "application/json;charset=utf-8"
    }));
}

function onSubmit(e) {
    e.preventDefault();

    const formData = serialize(this.elements.form, {
        hash: true
    });
    console.log(formData);


    this.model.mapSettings.setMatrixSize(new Size(parseInt(formData.sizeX), parseInt(formData.sizeY)));


}


//     Functions.fileReaderSetup(this);

//

function fileReaderSetup() {
    this.fileReader = new FileReader();
    this.fileReader.addEventListener('load', (evt) => {
        let data = {};
        try {
            data = JSON.parse(evt.target.result);
        } catch (e) {
            console.error('can\'t parse json file');
        }
        this.model.mapSettings.import(data);
        this.elements.importButton.value = null;
    });
    this.fileReader.addEventListener('error', () => console.error('error reading file'));
}
