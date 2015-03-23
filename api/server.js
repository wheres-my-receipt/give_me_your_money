var Hapi 	= require('hapi');
var Bell 	= require('bell');
var Cookie 	= require('hapi-auth-cookie');
var routes 	= require('./routes/routes.js');
var config 	= require('./config.js');
var port 	= {port: (process.env.port || 3000 ) };
var server 	= new Hapi.Server({});

server.connection(port);

server.register([Bell, Cookie], function (err) {
    if (err) {throw err;}

    server.auth.strategy('github', 'bell', {
        provider: 'github',
        password: config.github.secret,
        isSecure: false,
        clientId: config.github.cKey,
        clientSecret: config.github.cSecret,
        providerParams: {
        	redirect_uri: "http://localhost:" + port
        }
    });

    server.auth.strategy('session', 'cookie', {
        password: config.cookie.password,
        cookie: 'sid',
        redirectTo: '/',
        redirectOnTry: false,
        isSecure: false
    });

    server.route(routes);
});


module.exports = server;
