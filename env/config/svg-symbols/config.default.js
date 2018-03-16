"use strict";

var path = require('upath');
var prefix = 'svg_symbol_default_';
module.exports = {
    svgClassname: 'default',
    id: '%f',
    className: '.' + prefix + '%f',
    templates: [
        path.join(__dirname, 'tmpl', 'default.pcss'),
        path.join(__dirname, 'tmpl', 'default.svg')
    ],
    slug: function(name) {
        return name.replace(/[^a-zA-Z0-9_]/g, '_');
    },
    transformData: function(svg, data) {
        return {
            id: prefix + data.id,
            className: data.className,
            width: svg.width + 'px',
            height: svg.height + 'px',
            prefix: prefix,
            ratio: svg.height / svg.width,
            filename: 'default.svg'
        };
    }
};
