var Bell 	= require("bell");
//var Boom 	= require("boom");
var path 	= require("path");
var model 	= require("../models/members.js");
var Joi 	= require("joi");

var joiSchema = Joi.object().keys({ /* to be defined */});

module.exports = {

	home : {
		auth: {
			strategy: "github"
		},
		handler: function (request, reply) {
			var g = request.auth.credentials;
			// console.log( g );
			console.log( g.profile.raw );
			var profile ={
				username 	: g.username,
				displayname	: g.displayname,
				email 		: g.email,
				avatar 		: g.profile.raw.avatar_url,
				url 		: g.profile.raw.url
			};
	        request.auth.session.set(profile);
	    	return reply.redirect("/signup");
		}
	},
	signup: {
		auth: {
			strategy: 'session'
		},
		handler: function (request, reply){
			return reply( 'signup path');
		}
	},
	logout: {
		handler: function (request, reply ){
			request.auth.session.clear();
			return reply( "logout path");
		}
	},
	account: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "account path");
		}
	},
	messages: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "messages path");
		}
	},
	admin: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "admin path");
		}
	},
	getMember: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "getMember path");
		}
	},
	getAccount: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "getAccount path");
		}
	},
	createAccount: {
		auth: {
        	strategy: 'session',
        },
        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {
			return reply( "createAccount path");
		}
	},
	updateAccount: {
		auth: {
        	strategy: 'session',
        },
        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {
			return reply( "updateMember path");
		}
	},
	deleteAccount: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "deleteAccount path");
		}
	}
};
