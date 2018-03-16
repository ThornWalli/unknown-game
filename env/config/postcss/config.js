"use strict";

var path = require('upath');
module.exports = {
    parser: false,
    plugins: [
        require('postcss-import')({
            resolve: resolve
        }),
        require('postcss-url')({
            url: 'inline',
            encodeType: 'base64',
            maxSize: 10
        }),
        require('precss'),
        require('postcss-cssnext')({
            'browsers': ['> 2%', 'last 2 versions', 'IE 11', 'Firefox ESR']
        }),
        require('postcss-calc'),
        require('postcss-clearfix'),
        require('postcss-discard-comments'),
        require('cssnano')({
            zindex: false,
            autoprefixer: false
        }),
        require('postcss-browser-reporter'),
        require('postcss-reporter')
    ]
};

function resolve(id, basedir, importOptions) {
    if (id.match(/gp-boilerplate-|gp-module-/)) {
        if (id.match(RegExp(process.env.npm_package_name + '\/.*')) || id.match(RegExp('^' + process.env.npm_package_name + '$'))) {
            id = path.relative(basedir, path.resolve(importOptions.root, id.replace(/gp-boilerplate-[^/]*|gp-module-[^/]*/, 'src')));
        } else {
            id = path.relative(basedir, path.resolve(importOptions.root, 'node_modules', id));
        }
        if (!id.match(/.*\.(pcss|css)$/)) {
            id = path.join(id, 'default.pcss');
        }
    } else if (id.indexOf('/') === 0) {
        id = path.join(process.cwd(), id);
    }
    return id;
}
