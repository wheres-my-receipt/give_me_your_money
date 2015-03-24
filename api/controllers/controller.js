var Bell 	= require("bell");
//var Boom 	= require("boom");
var path 	= require("path");
var model 	= require("../models/members.js");
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
				console.log( request.auth);

				request.auth.session.clear();
				console.log( request.auth);
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
			console.log( request.auth);

			request.auth.session.clear();

			console.log( 'cleared session ' + request.auth );
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
			return reply( "updateMember path");
		}
	},
	deleteAccount: {

		handler: function (request, reply) {
			return reply( "deleteAccount path");
		}
	}
};
