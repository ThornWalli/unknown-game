"use strict";

// IE 11
import 'element-closest';

import 'script-loader!fg-loadcss';
import 'script-loader!fg-loadcss/src/cssrelpreload';
import 'gp-module-polyfills';
import './embed/fontfaceObserver';
import './embed/prefix';

// SVG Reference Polyfill
import svg4everybody from 'svg4everybody';
svg4everybody();
