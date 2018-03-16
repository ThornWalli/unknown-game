'use strict';

var merge = require('extend-shallow');

module.exports = function (engine) {
    if(require('handlebars-layouts')(engine) !== engine.helpers.extend) {
        engine.registerHelper(require('handlebars-layouts')(engine));
    }

    return function (name) {
        var options = arguments[2] || arguments[1];
        var context = {};
        if(arguments[2]) {
            context = arguments[1];
        }

        if (typeof name !== 'string') {
            return '';
        }
        var ctx = {};
        var localContext = {};

        if(localContext) {
            ctx = merge(ctx, localContext.data || localContext, getContextData(context));
        }
        ctx.relativeToRoot = options.data.root.relativeToRoot;
        return engine.helpers.extend(name, ctx, options);
    };
};

function getContextData(context) {
    if(context) {
        if(context.data) {
            if (context.data.root) {
                return context.data.root;
            } else {
                return context.data;
            }
        } else {
            return context;
        }
    } else {
        return {};
    }
}
