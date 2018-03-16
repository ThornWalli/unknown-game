"use strict";

/**
 * Extends from config.default.js
 */
var prefix = 'svg_symbol_icon_';
module.exports = Object.assign(require('./config.default'), {
    svgClassname: 'icon',
    id: 'symbol_icon_%f',
    className: '.' + prefix + '%f',
    transformData: function(svg, data) {
        return {
            id: prefix + data.id,
            className: data.className,
            width: svg.width + 'px',
            height: svg.height + 'px',

            prefix: prefix,
            ratio: svg.height / svg.width,
            filename: 'icon.svg'
        };
    }
});
