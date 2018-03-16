"use strict";

var htmlprettify = require('gulp-html-prettify');
var htmlmin = require('gulp-htmlmin');

module.exports = [
    {
        development: false,
        production: true,
        build: true,
        module: htmlmin({
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            keepClosingSlash: true,
            preserveLineBreaks: false,
            quoteCharacter: '"',
            minifyJS: true,
            minifyCSS: true
        })
    }, {
        development: false,
        production: true,
        build: true,
        module: htmlprettify({
            indent_inner_html: true,
            indent_handlebars: true,
            brace_style: 'expand',
            indent_size: 4  ,
            indent_char: ' ',
            max_char: 0,
            unformatted: ["sub", "sup", "b", "i", "u", "script", "span", "code", "svg"]
        })
    }
];
