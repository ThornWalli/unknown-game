"use strict";
var path = require('upath');
module.exports = {
    options: {
        fontSize: 16,
        filePrefix: "",
        prefix: "grid",
        columnPrefix: "grid-col",
        columns: 12,
        breakpoints: [{
                name: "default",
                width: "20rem",
                gutter: "0.9375rem"
            },
            {
                name: "xs",
                width: "30rem"
            },
            {
                name: "sm",
                width: "48rem",
            },
            {
                name: "md",
                width: "62rem",
            },
            {
                name: "lg",
                width: "75rem",
            }
        ]
    },
    features: [{
            name: 'base',
            file: require('gp-boilerplate-environment/lib/tasks/grid/base'),
            options: {
                root: path.join('node_modules/purecss/build'),
                pureFiles: ["base", "grids-core"]
            }
        }, {
            name: 'variables',
            file: require('gp-boilerplate-environment/lib/tasks/grid/variables')
        },
        {
            name: 'gutter',
            file: require('gp-boilerplate-environment/lib/tasks/grid/gutter')
        },
        {
            name: 'offset',
            file: require('gp-boilerplate-environment/lib/tasks/grid/offset')
        },
        {
            name: 'wrapper',
            file: require('gp-boilerplate-environment/lib/tasks/grid/wrapper'),
            options: {
                breakpoints: [{
                        name: "xs",
                        properties: {
                            "margin-left": "auto",
                            "margin-right": "auto"
                        }
                    },
                    {
                        name: "md",
                        properties: {
                            "max-width": "$screen-md"
                        }
                    },
                    {
                        name: "lg",
                        properties: {
                            "max-width": "$screen-lg"
                        }
                    }
                ]
            }
        },
        {
            name: 'visible-hidden',
            file: require('gp-boilerplate-environment/lib/tasks/grid/visible-hidden'),
            options: {
                important: true
            }
        }
    ]
};
