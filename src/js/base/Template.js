"use strict";

import Template from 'gp-module-base/Template';
import {
    handlebars
} from 'gp-module-base/Template';

import stringify from './template/helpers/stringify';
import replace from './template/helpers/replace';
import fallback from './template/helpers/fallback';
import mixin from './template/helpers/mixin';


/*
 * Partials
 */

// Atoms

// import atomsListItem from '../../tmpl/partials/atoms/list/item.hbs';
// handlebars.registerPartial('atoms/list/item', atomsListItem);

/*
 * Helpers
 */

handlebars.registerHelper('replace', replace);
handlebars.registerHelper('stringify', stringify);
handlebars.registerHelper('fallback', fallback);
handlebars.registerHelper('mixin', mixin(handlebars));

export default Template;
export {
    handlebars
};
