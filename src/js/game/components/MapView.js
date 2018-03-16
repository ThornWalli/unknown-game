'use strict';

import Size from '../base/Size';

export default class MapView {
    constructor(app, canvas) {
        this._app = app;
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
            app.display.on('refresh', onRefresh, this).on('reset', onRefresh, this);
            app.map.on('refresh', onRefresh, this);
    }

    refresh() {
        this._canvas.width = this._canvas.offsetWidth;
        this._canvas.height = this._canvas.offsetHeight;
        if (this._app.map.size.height > this._app.map.size.width) {
            /*
             * Vertical
             * 000111000
             * 000111000
             * 000111000
             * 000111000
             */
            this._bgSize = new Size(this._canvas.width * (this._app.map.size.width / this._app.map.size.height), this._canvas.height);
        } else {
            /*
             * Horizontal
             * 000000000
             * 111111111
             * 111111111
             * 000000000
             */
            this._bgSize = new Size(this._canvas.width, this._canvas.height * (this._app.map.size.height / this._app.map.size.width));
        }
        this.render();
    }

    /**
     * Set Position by Pixel-Position
     */
    setPosition(position) {
        this._app.display.setPosition(position.multiplyLocal(this._app.map.size).floorLocal());
    }

    render() {
        let x = (this._canvas.width - this._bgSize.width) / 2,
            y = (this._canvas.height - this._bgSize.height) / 2;
        const map = this._app.map,
            display = this._app.display,
            ctx = this._context;
        const size = map.size,
            visibleSize = display.visibleSize;

        const unitSize = this._bgSize.divide(size).parseIntLocal(),
            offset = this._bgSize.clone();
        this._bgSize.setLocal(unitSize.multiply(size));
        offset.subtractLocal(this._bgSize);

        x += offset.x / 2;
        y += offset.y / 2;

        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        // background
        ctx.fillStyle = '#111';
        ctx.fillRect(x, y, this._bgSize.width, this._bgSize.height);

        ctx.fillStyle = '#baed91';
        map.units.forEach(unit => {
            const position = this.getPositionFromUnit(unit).multiplyLocal(unitSize);
            ctx.fillRect(x + position.x, y + position.y, unitSize.width, unitSize.height);
        });

        // selection

        x += display.visibleBounds.min.x * unitSize.width;
        y += display.visibleBounds.min.y * unitSize.height;
        ctx.fillStyle = 'rgba(254, 162, 169, 0.1)';

        const position = this._bgSize.multiply(visibleSize.divide(size)).subtractValuesLocal(-1, -1);

        ctx.strokeStyle = '#fea3aa';
        ctx.beginPath();
        ctx.rect(x - 0.5, y - 0.5, position.x, position.y);
        ctx.fill();
        ctx.stroke();

    }

    getPositionFromUnit(unit) {
        const position = unit.position.clone();
        return position;
    }

}

function onRefresh() {
    this.refresh();
}
