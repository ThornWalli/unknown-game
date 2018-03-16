"use strict";

exports.register = function (server, options, next) {

    server.route({
        method: ['GET'],
        path: "/debug",
        config: {
            auth: false
        },
        handler: function(request, reply) {
            reply(generateResponseData(request, server).then(function(info) {
                return info;
            }).then(function(data) {
                return request.generateResponse({code: '200', data: data}).code(200);
            }).catch(function(message) {
                return request.generateResponse({code: '403', error: {message: message.toString()}}).code(403);
            }));
        }
    });

    next();
};

function generateResponseData(request, server) {
    return new Promise(function(resolve) {
        resolve({
            node: process.version,
            hapi: server.version,
            host: server.info.host,
            port: server.info.port,
            uri: server.info.uri,
            routes: server.table()[0].table.map(function(item) {
                return {
                    path: item.path,
                    method: item.method,
                    plugin: item.public.realm.plugin
                };
            })
        });
    });

}

exports.register.attributes = {
    name: 'debug',
    version: '1.0.0'
};
