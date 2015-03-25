var Bell 	 = require("bell");
var path 	 = require("path");
var moment 	 = require("moment");
var Joi 	 = require("joi");
var stripe 	 = require("stripe")(require("../config.js").stripe.sk);
var config 	 = require('../config.js');
var accounts = require("../models/accounts.js");
var messages = require("../messages/messages.js");

var creationValidation = Joi.object({
		email: Joi.string().email().required(),
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		phone_number: Joi.string().required()
	});

var updateValidation = Joi.object({
		email: Joi.string().email(),
		first_name: Joi.string(),
		last_name: Joi.string(),
		phone_number: Joi.number()
	}).or("email", "first_name", "last_name", "phone_number");

module.exports = {

	home: {
		auth: false,
		handler: function (request, reply ) {
			console.log( 'in home handler');
			if(request.auth.isAuthenticated) {
				console.log( 'in home handler');
				return reply.redirect("/account");
			}
			console.log( 'Not Authenticated home handler');

			return reply.view('login.jade');
		}
	},

	login : {
		auth: {
			strategy: "github"
		},
		handler: function (request, reply) {
			if (request.auth.isAuthenticated) {
				var g = request.auth.credentials;
				var profile ={
					username 	: g.profile.username,
					email 		: g.profile.email,
					avatar 		: g.profile.raw.avatar_url,
					url 		: g.profile.raw.url
				};

				// var t = request.auth.credentials;
		  //       var profile = {
		  //           token: t.token,
		  //           secret: t.secret,
		  //           twitterId: t.profile.id,
		  //           twitterName: t.profile.username,
		  //           fullName: t.profile.displayName,
		  //       };
				request.auth.session.clear();
		        request.auth.session.set(profile);

		    	return reply.redirect("/signup");
		    }
		    else reply('Not logged in, should be forwarded to bell login...').code(401);
		}
	},

	logout: {
		handler: function (request, reply ){
			console.log( 'in logout handler');
			request.auth.session.clear();
			return reply.redirect('/');
		}
	},

	signup: {
		handler: function (request, reply){
			if(request.auth.isAuthenticated) {
				return reply.view("signup.jade");
			}
		}
	},

	account: {
		handler: function (request, reply) {

			var userToFind = request.auth.credentials.username;

			accounts.getAccount(userToFind, function(err, result) {
				if (err) {return reply(err);}
				console.log(result);
				return reply.view('account.jade', {user: result});
			});
		}
	},

	messages: {
		handler: function (request, reply) {
			if(request.auth.isAuthenticated) {
				var user = request.auth.credentials;
				//var member = request.params.member;
				console.log( 'In getMessages, member: ' + user );
				accounts.getAccount( user, function (err, data ) {

				});
			}
			// get all messages from mailgun or database
			return reply.file( "messages.html");
		}
	},

	admin: {
		handler: function (request, reply) {
			return reply.file('admin.html');
		}
	},


	serveFile: {
		// set to false so that resources load when logged out
		// but, security issue if a page is requested by path. Might need to need 'views' out of public
		auth: false,
		handler: {
			directory: {
				path: '../public'
			}
		}
	},

	// Payment Operations
	payment: {
		handler: function (request, reply) {

			var paymentFor 		= request.params.type;
			var stripeToken		= request.payload.stripeToken;
			var accountToUpdate = request.auth.credentials.username;
			var newCharge;

			// Change this all to do a DB query 'pon receipt, check their status here, then proceed
			// Do the charge stuff
			var paymentSchemes = {
				membership: {
					amount: 5000,
					description: "Membership for 1 year",
					type: "membership"
				},
				desk1: {
					amount: 5000,
					description: "Desk rental 1 month - tier 1",
					type: "desk"
				},
				desk2: {
					amount: 10000,
					description: "Desk rental 1 month - tier 2",
					type: "desk",
				},
				desk3: {
					amount: 20000,
					description: "Desk rental 1 month - tier 3",
					type: "desk"
				}
			};

			var chargeMaker = function(paymentScheme, token) {
				return {
					amount: paymentScheme.amount,
					currency: "gbp",
					source: token,
					description: paymentScheme.description,
				};
			};

			if (paymentSchemes[paymentFor]) {
				newCharge =	chargeMaker(paymentSchemes[paymentFor], stripeToken);
			} else {
				return reply("Naughty naughty!");
			}

			var charge = stripe.charges.create(newCharge, function(err, charge) {
				if (err) {return reply(err);}

				var transactionObject = {
					name: request.payload.stripeEmail,
					date: charge.created + "000",
					amount: charge.amount,
					type: paymentSchemes[paymentFor].type,
				};
				return accounts.newTransaction(accountToUpdate, transactionObject, function(err, result) {
					if (err) {return reply(err);}
					return reply(result);
				});
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
				if (err) {return reply(err);}
				return reply(result);
			});
		}
	},

	createAccount: {
        validate:{
                payload: creationValidation,
        },
		handler: function (request, reply) {
			console.log('In createAccount');
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

				desk_rental_rate: 5000,
			};


			accounts.createAccount(accountToCreate, function(err, result) {
				if (err) {
					console.log( "Error: " + err );
					return reply(err);
				}
				// add to all members email group and send ack email
				var emailDetails = accountToCreate;
				emailDetails.emailType = "acknowledge";
				messages.addToMembersList(accountToCreate);
				messages.sendEmail(accountToCreate, function( error, data ) {
					if( err ) {
						console.log( "Error sending acknowledge email: " + error );
					}
					return reply( result );
				});

			});
		}
	},

	getAccount: {
		handler: function (request, reply) {
			var userToFind = request.params.member;
			accounts.getAccount(userToFind, function(err, result) {
				if (err) {return reply(err);}
				return reply(result);
			});
		}
	},


	updateAccount: {
        validate:{
                payload: updateValidation,
        },
		handler: function (request, reply) {

			var userToUpdate = request.params.member;
			var updateTheseFields = request.payload;

			accounts.updateAccount(userToUpdate, updateTheseFields, function(err, result) {
				if (err) {return reply(err);}
				return reply(result);
			});
		}
	},

	deleteAccount: {
		handler: function (request, reply) {
			var userToDelete = request.params.member;
			console.log(userToDelete);

			accounts.deleteAccount(userToDelete, function(err, result) {
				if (err) {return reply(err);}
				return reply(result).location("/logout");
			});
		}
	},

	createMessage : {
		handler : function (request, reply) {
			var member = request.params.member;
			var message = request.payload;
			console.log( 'In createMessages, member: ' + member );
			console.log( 'Message to send: '+ message );

			//var recipient_user	= request.payload.recipient;
			var emailDetails = {
				emailType: request.payload.emailType,
				email: request.payload.email,
				username: request.payload.username,
				first_name: request.payload.first_name,
				last_name: request.payload.last_name,
				subject: request.payload.subject,
				content: request.payload.text
			};

			messages.sendEmail( emailDetails, function ( error, body ) {
				if( error ){
					console.log( "Error sending " + emailDetails.emailType + ": " + error );
					return reply( error );
				}
				else {
					// STICK IT IN THE DATABASE
					console.log( "body: " + body);
					var messageObject = {
						to: emailDetails.email,
						from: 'facmembershipadmin@gmail.com',
						date: moment().format('MMMM Do YYYY'),
						subject: emailDetails.subject ,
						content: emailDetails.text
					};
					return accounts.newMessage(member, messageObject, function (err, result) {
						if (err) {
							console.log( "Error adding new message: " + err);
							return reply(err);
						}
						console.log( "Successfully added: " + results );
						return reply(result);
					});
				}
			});

		}
	}
};
