"use strict";


module.exports = [
    {
        development: true,
        production: false,
        config: {
            module: require('@danielbayerlein/hapi-webpack-middleware'),
            options: {
                webpack: Object.assign(require('../webpack/config')('app'), {
                    entry: {
                        app: ['./src/js/main','webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true']
                    },
                    output: {
                      path: '/dev/js',
                      filename: '[name].js',
                      publicPath: '/dev/js/',
                      library: ['[name]'],
                      chunkFilename: "app.[chunkhash].js"
                    }
                }),
                webpackDev: require('./server/dev'),
                webpackHot: require('./server/hot')
            }
        }
    }, {
        development: true,
        production: false,
        config: {
            module: require('../../routes/debug'),
            options: {}
        }
    }, {
        development: true,
        production: false,
        config: {
            module: require('gp-boilerplate-webserver/lib/hapi/route/auth/session'),
            options: {
              appId: '1649448378651481',
              appSecret: 'f6ef2995e1483b161d013c49e86c0273'
            }
        }
    }, {
        development: true,
        production: true,
        config: {
            module: require('gp-boilerplate-webserver/lib/hapi/route/static'),
            options: {
              config: {
                state: {
                  parse: false,
                  failAction: 'ignore'
                }
              }
            }
        }
    }, {
        development: true,
        production: false,
        config: {
            module: require('gp-boilerplate-webserver/lib/hapi/route/proxy'),
            options: {}
        }
    }
];
