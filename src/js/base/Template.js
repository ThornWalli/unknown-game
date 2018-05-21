"use strict";

import js from 'gp-module-parser';
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



const imports = new Map();

import atoms_table from '../../tmpl/partials/atoms/table.hbs';
imports.set('atoms/table', atoms_table);

import atoms_tableContent from '../../tmpl/partials/atoms/table/content.hbs';
imports.set('atoms/table/content', atoms_tableContent);

import organisms_dialog from '../../tmpl/partials/organisms/dialog.hbs';
imports.set('organisms/dialog', organisms_dialog);

import molecules_tabContainer from '../../tmpl/partials/molecules/tab-container.hbs';
imports.set('molecules/tab-container', molecules_tabContainer);

import organisms_dialog_detailInfo from '../../tmpl/partials/organisms/dialog/detail-info.hbs';
imports.set('organisms/dialog/detail-info', organisms_dialog_detailInfo);





imports.forEach((value, key) => {
    handlebars.registerPartial(key, value);
});


/*
 * Helpers
 */

handlebars.registerHelper('replace', replace);
handlebars.registerHelper('stringify', stringify);
handlebars.registerHelper('fallback', fallback);
handlebars.registerHelper('mixin', mixin(handlebars));

const parse = js.parse.bind(js);

export default Template;
export {
    handlebars,
    parse
};
