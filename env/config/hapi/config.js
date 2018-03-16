"use strict";

var fs = require('fs');
var path = require('path');
var hapi = {
    host: 'localhost',
    port: 8050,
    secret: 'UNSAFE: CHANGE ME',
    routes: require('./routes')
};

// var tlsPath = path.resolve(process.cwd() + '/tls');
// if (fs.existsSync(tlsPath)) {
//     hapi.tls = {
//         key: fs.readFileSync(path.resolve(tlsPath + '/privateKey.key')),
//         cert: fs.readFileSync(path.resolve(tlsPath + '/certificate.crt'))
//     };
// }

module.exports = {
    dev: (process.env.NODE_ENV === 'development'),
    dest: (process.env.NODE_ENV === 'development') ? 'dev' : process.env.NODE_ENV,
    root: './' + ((process.env.NODE_ENV === 'development') ? '' : process.env.NODE_ENV),

    hapi: hapi,
    servers: []
};

/*
 * Create TLS Files
 * sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt
 */
