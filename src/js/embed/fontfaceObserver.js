"use strict";

import FontFaceObserver from 'fontfaceobserver/fontfaceobserver';

(function(window) {
    if ('customFonts' in window) {
        window.customFonts.forEach(function(font) {
            var observer = new FontFaceObserver(font.name, font.props);
            var className = 'font-' + font.name.replace(/ /g, '-') + '-' + font.props.style + '-' + font.props.weight;
            observer.check(font.testString).then(function() {
                document.documentElement.classList.add(className);
            }, function() {
                document.documentElement.classList.add('no-' + className);
            });
        });
    }
})(global);
