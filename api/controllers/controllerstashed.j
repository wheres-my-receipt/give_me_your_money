var Bell 	= require("bell");
//var Boom 	= require("boom");
var path 	= require("path");
var model 	= require("../models/members.js");
var config 	= require('../config.js');
var api_key = config.mailgunTest.apiKey;
var domain 	= config.mailgunTest.domain;
var port = {port: (process.env.port || 3000 ) };
//var proxy 	= config.mailgunTest.proxy + port;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var Joi 	= require("joi");

var joiSchema = Joi.object().keys({ /* to be defined */});

module.exports = {

	home : {
		auth: {
			strategy: "twitter"
		},
		handler: function (request, reply) {
			if (request.auth.isAuthenticated) {
				var g = request.auth.credentials;
				//console.log( g.expiresIn );
				//console.log( g.profile.raw );
				var profile ={
					username 	: g.username,
					displayname	: g.displayname,
					email 		: g.email,
					avatar 		: g.profile.raw.avatar_url,
					url 		: g.profile.raw.url
				};

				request.auth.session.clear();
		        request.auth.session.set(profile);
				// console.log( request.auth.session );

		    	return reply.redirect("/signup");
		    }
		    else reply('Not logged in...').code(401);
		}
	},
	signup: {
		auth: {
			mode: 'optional'
		},
		handler: function (request, reply){
			if(request.auth.isAuthenticated) {
				return reply( 'signup path');
			}
			else reply('Not Authenticated Yet');
		}
	},
	logout: {

		handler: function (request, reply ){
			console.log( 'in logout handler');
			// console.log( request.auth);

			request.auth.session.clear();

			// console.log( 'cleared session ' + request.auth );
			return reply.redirect('/');
		}
	},
	account: {

		handler: function (request, reply) {
			if(request.auth.isAuthenticated) {
				return reply( "account path");
			}
		}
	},
	messages: {

		handler: function (request, reply) {
			return reply( "messages path");
		}
	},
	admin: {

		handler: function (request, reply) {
			return reply( "admin path");
		}
	},
	getMember: {

		handler: function (request, reply) {
			return reply( "getMember path");
		}
	},
	createEmail: {
		handler: function( request, reply ) {
			console.log( 'In createEmail');
			var data = {
 				 from: 'Excited User <sarahabimay@gmail.com>',
  				 to: 'fac4membershipapp@gmail.com',
 				 subject: 'Hola Mi Amigos',
				 text: 'Testing some Mailgun awesomness!'
			};

			mailgun.messages().send(data, function (error, body) {
  				console.log( "In mailgun send cb: " + body);
				console.log( error);

			});
		}
	},
	getAccount: {

		handler: function (request, reply) {
			return reply( "getAccount path");
		}
	},
	createAccount: {

        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {
			return reply( "createAccount path");
		}
	},
	updateAccount: {

        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {
			var list = mailgun.lists('fac4membershipapp@gmail.com');

			list.info(function (err, data) {
			  // `data` is mailing list info
			  console.log( err );
			  console.log(data);
			});
			return reply( "updateMember path");
		}
	},
	deleteAccount: {

		handler: function (request, reply) {
			return reply( "deleteAccount path");
		}
	}
};
