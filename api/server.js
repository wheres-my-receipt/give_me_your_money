var Hapi = require('hapi');
var Bell = require('bell');
var Cookie = require('hapi-auth-cookie');
var Path = require( 'path');
var routes = require( './routes/routes.js');
var config = require('./config.js');

var server = new Hapi.Server({
    // connections: {
    //     routes: {
    //         files: {
    //             relativeTo: Path.join(__dirname, 'public/css')
    //         }
    //     }
    // }
});
server.connection({port: (process.env.port || 3000 ) });

server.register([Bell, Cookie], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugins
    }

    server.auth.strategy('github', 'bell', {
        provider: 'github',
        password: config.github.password,
        isSecure: false,
        clientId: config.github.clientId,
        clientSecret: config.github.clientSecret,
        providerParams: {
        	redirect_uri: "http://localhost:3000"
        }
    });

    server.auth.strategy('session', 'cookie', {
        password: config.cookie.password,
        cookie: 'sid',
        redirectTo: '/login',
        redirectOnTry: false,
        isSecure: false
    });

    server.route( routes );
});


module.exports = server;
