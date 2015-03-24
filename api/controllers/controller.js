var Bell 	 = require("bell");
var path 	 = require("path");
var Joi 	 = require("joi");
var stripe 	 = require("stripe")(require("../config.js").stripe.sk);
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
				console.log(g);
				var profile ={
					username 	: g.profile.username,
					email 		: g.profile.email,
					avatar 		: g.profile.raw.avatar_url,
					url 		: g.profile.raw.url
				};

				request.auth.session.clear();
		        request.auth.session.set(profile);

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
				return reply.file("signup.html");
			}
			else return reply.redirect('/');
		}
	},

	account: {
		handler: function (request, reply) {
			if(request.auth.isAuthenticated) {
				return reply.file('account.html');
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
			console.log(request);
			var stripeToken = request.payload.stripeToken;

			var charge = stripe.charges.create({
			  amount: 1000, // amount in cents, again
			  currency: "gbp",
			  source: stripeToken,
			  description: "payinguser@example.com"
			}, function(err, charge) {
				if (err && err.type === 'StripeCardError') {
			    	return reply(err);
				}
				return reply(charge);
			});
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
	createAccount: {
        // validate:{
        //         payload: joiSchema,
        // },
		handler: function (request, reply) {

			var user = request.payload;
			var accountToCreate = {

				email: user.email || request.auth.credentials.email,
				username: request.auth.credentials.username,
				first_name: user.first_name,
				last_name: user.last_name,
				member_since: new Date(),
				phone_number: user.phone_number,

				github_link: request.auth.credentials.url,
				github_avatar: request.auth.credentials.avatar,

				membership_active_status: false,

				desk_authorization: false,

				desk_rental_rate: 50,


				transaction_history: ["temporary"],
				message_history: ["temporary"]
			};


			accounts.createAccount(accountToCreate, function(err, result) {
				if (err) {
					return reply(err);
				}
				return reply(result);
			});
		}
	},

	getAccount: {
		handler: function (request, reply) {

			accounts.getAccount(function(err, result) {
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
