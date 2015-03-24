var Bell 	 = require("bell");
var path 	 = require("path");
var Joi 	 = require("joi");
var Stripe 	 = require("stripe")(require("../config.js").stripe.sk);
var accounts = require("../models/accounts.js");

var joiSchema = Joi.object().keys({ /* to be defined */});

module.exports = {


	home: {
		auth: {
			mode: 'optional'
		},
		handler: function (request, reply ) {
			return reply.file('login.html');
		}
	},

	login : {
		auth: {
			strategy: "github"
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

	logout: {
		handler: function (request, reply ){
			console.log( 'in logout handler');
			console.log( request.auth);

			request.auth.session.clear();

			console.log( 'cleared session ' + request.auth );
			return reply.redirect('/');
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
			else return reply.redirect('/');
		}
	},

	account: {
		handler: function (request, reply) {
			if(request.auth.isAuthenticated) {
				return reply( "account path");
			}
			else return reply.redirect('/');
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


	serveFile: {
		auth: {
			mode: 'optional'
		},
		handler: {
			directory: {
				path: '../public'
			}
		}
	},

	// Payment Operations
	payment: {
		handler: function (request, reply) {
			return reply( "make a payment");
		}
	},


	getMember: {
		handler: function (request, reply) {
			return reply( "getMember path");
		}
	},


	// DB Operations
	getAccounts: {
		handler: function(request, reply) {

			accounts.getAccounts(function(err, result) {
				if (err) {
					return reply(err);
				}
				return reply(result);
			});
		}
	},

	getAccount: {
		handler: function (request, reply) {

			accounts.getAccounts(function(err, result) {
				if (err) {
					return reply(err);
				}
				return reply(result);
			});
		}
	},

	createAccount: {
        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {

			var accountToCreate = request.payload.accountDetails; // User object

			accounts.createAccount(accountToCreate, function(err, result) {
				if (err) {
					return reply(err);
				}
				return reply(result);
			});
		}
	},

	updateAccount: {
        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {

			var userToUpdate = request.payload.user; // payload.user is just a placeholder data location
			var updateTheseFields = {};

			accounts.updateAccount(userToUpdate, function(err, result) {
				if (err) {
					return reply(err);
				}
				return reply(result);
			});
		}
	},

	deleteAccount: {
		handler: function (request, reply) {

			var userToDelete = request.payload.user; // payload.user is just a placeholder data location

			accounts.deleteAccount(userToDelete, function(err, result) {
				if (err) {
					return reply(err);
				}
				return reply(result);
			});
		}
	}
};
