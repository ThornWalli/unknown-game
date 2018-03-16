"use strict";

module.exports = {
    noInfo: false,
    // display no info to console (only warnings and errors)

    quiet: false,
    // display nothing to the console

    lazy: false,
    // switch into lazy mode
    // that means no watching, but recompilation on every request

    publicPath: '/dev/js/',
    // public path to bind the middleware to
    // use the same as in webpack

    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: true
    },
    // watch options (only lazy: false)

    index: 'dev/index.html',
    // the index path for web server

    headers: { 'X-Custom-Header': 'yes' },
    // custom headers

    stats: {
        colors: true
    },
    // options for formating the statistics

    reporter: null,
    // Provide a custom reporter to change the way how logs are shown.

    serverSideRender: false,
    // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
};
