var Bell 	 = require("bell");
var path 	 = require("path");
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
	}).options({allowUnknown: true});
// .or("email", "first_name", "last_name", "phone_number");

module.exports = {

	homeView: {
		auth: false,
		handler: function (request, reply ) {
			if(request.auth.isAuthenticated) {
				return reply.redirect("/account");
			}
			console.log( 'Not Authenticated - Go to login page');
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
			console.log( 'In logout handler');
			request.auth.session.clear();
			return reply.redirect('/');
		}
	},

	signupView: {
		handler: function (request, reply){
			if(request.auth.isAuthenticated) {
				var username = request.auth.credentials.username;
				var foundAccount;
				return accounts.getAccount( username, function( err, result ){
					console.log( "In getAccount callback");
					if (result) {
						console.log( 'User already signed up ' + err );
						return reply.redirect('/account');
					}
					console.log( 'Have not found user so forward to member page');
					return reply.view("signup");
				});
			}
		}
	},

	accountView: {
		handler: function (request, reply) {

			var userToFind = request.auth.credentials.username;
			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			var today = new Date();
			var thisMonth = today.getMonth();
			accounts.getAccount(userToFind, function(err, result) {
				if (err) {
					return reply.view("account", { user: undefined, alerts: [{isError: true, alert: "Error: " + err }]});
				}
				console.log( "Account View: " + result );
				return reply.view('account', {user: result, months: months, thisMonth: thisMonth});
			});
		}
	},

	messagesView: {
		handler: function (request, reply) {
			if(request.auth.isAuthenticated) {
				var userToFind = request.auth.credentials.username;
				console.log( 'MessagesView user: ' + userToFind);
				accounts.getAccount( userToFind, function (err, data ) {
					if(err) {
						return reply.view("messages", { user: undefined, alerts: [{isError: true, alert: "Error: " + err }]});
					}
					if( !data ){
						return reply.view("messages", { user: undefined });
					}
					return reply.view("messages", { user: userToFind, messages: data.message_history });
				});
			}
			else{
				return reply.redirect( "/");
			}
		}
	},

	adminView: {
		handler: function (request, reply) {
			if(request.auth.isAuthenticated) {
				var userToFind = request.auth.credentials.username;
				console.log( 'Admin View, user: ' + userToFind );
				accounts.getAccount( userToFind, function (err, data ) {
					if(err) {
						return reply.view("admin_fail", { user: undefined, alerts: [{isError: true, alert: "Error: " + err }]});
					}
					if( !data ){
						return reply.view("admin_fail", { user: undefined });
					}
					if( data.admin_rights){
						// get all members for display on admin 'landing page'
						accounts.getAccounts( function (err, members ) {
							console.log( 'Found members numbering: ' + members.length );
							return reply.view("admin", { user: data, members: members });
						});
					}
					else {
						return reply.view("admin_fail", { user: data });
					}
				});
			}
			else{
				return reply.redirect("/account");
			}
		}
	},


	serveFile: {
		// set to false so that resources load when logged out
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
			// First, check the type of payment
			// If the type of payment is 'desk', check whether they are authorized
			// And if they have already paid for this month's desk space, deny the request?
			// If not, grab the rate from the DB and charge them for it
			// And add the 'paid' status to the current month of the year in the db

			// If the type of payment is 'membership', check their active status
			// If active, deny the request?
			// If not, charge them for 50 squid and set active_status to true
			// If they paid for their membership less than a year from today,
			// then extend membership_paid by 1 year.
			// else set membership_paid to now.

			var paymentFor 		= request.params.type;
			var stripeToken		= request.payload.stripeToken;
			var accountToUpdate = request.auth.credentials.username;
			var newCharge;
			var alerts = [];
			accounts.getAccount(accountToUpdate, function(err, result) {
				var paymentSchemes = {
					membership: {
						amount: 5000,
						description: "Membership for 1 year",
					},
					desk: {
						amount: result.desk_rental_rate,
						description: "Desk rental 1 month",
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

				if (paymentFor === "desk") {
					if (!result.desk_authorization) {
						return reply("You're not authorized to do that yet!");
					} else {
						newCharge = chargeMaker(paymentSchemes[paymentFor], stripeToken);
					}
				} else if (paymentFor === "membership") {
					newCharge = chargeMaker(paymentSchemes[paymentFor], stripeToken);
				} else {
					return reply("Unknown payment scheme");
				}
				var charge = stripe.charges.create(newCharge, function(err, charge) {
					if (err) {return reply(err);}
					alerts.push( {isSuccess: true, alert: "Thank you, your payment has been taken."});
					messages.sendEmail(result, "PaymentReceipt", function( error, data ) {
						if( error ) {
							alerts.push({isError:true, alert: "Error sending payment receipt."});
						}
					});
					var transactionObject = {
						name: request.payload.stripeEmail,
						date: charge.created + "000",
						amount: charge.amount,
						type: paymentFor
					};

					return accounts.newTransaction(accountToUpdate, transactionObject, function(err, success) {
						if (err) {return reply(err);}
						alerts.push( {isSuccess: true, alert: "Successfully Added To Transaction History" });
						console.log( 'Alerts: ' + alerts);
						return reply.view('account', {user: result, alerts: alerts });
						// return reply(success);
					});
				});
			});
		}
	},


	memberView: {
		handler: function (request, reply) {
			var userToFind = request.params.member;
			accounts.getAccount( userToFind, function( err, result ){
				if (err) {
					console.log( 'Error ' + err );
					return reply(err);
				}
				return reply.view( 'member', {user :result });
			});
		}
	},

	messageView: {
		handler: function (request, reply) {
			var userToFind = request.params.member;
			console.log( 'In messageView: ' + userToFind );
			accounts.getAccount( userToFind, function( err, result ){
				if (err) {
					console.log( 'Error ' + err );
					return reply(err);
				}
				return reply.view( 'message', {user :result });
			});
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
			var username = request.auth.credentials.username;

			var accountToCreate = {

				email: user.email || request.auth.credentials.email,
				username: request.auth.credentials.username,
				first_name: user.first_name,
				last_name: user.last_name,
				member_since: new Date(),
				phone_number: user.phone_number,
				admin_rights: false,
				github_link: request.auth.credentials.url,
				github_avatar: request.auth.credentials.avatar,

				membership_active_status: false,

				desk_authorization: false,

				desk_rental_rate: 5000,
			};


			accounts.createAccount(accountToCreate, function(err, result) {
				if (err) {
					console.log( "Error: " + err );
					return reply.view( 'signup', {user: undefined, alerts: [{isError: true, alert: err }]});
				}
				// add to all members email group and send ack email
				messages.addToMembersList(accountToCreate);
				messages.sendEmail(accountToCreate, "Acknowledge", function( error, data ) {
					if( err ) {
						return reply.view( 'account', {user: result, alerts: [{isError:true, alert: "Error sending sign up confirmation"}]});
					}
					return reply.view('account', {user: result });
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

			accounts.deleteAccount(userToDelete, function(err, result) {
				if (err) {console.log(err);return reply(err);}
				return reply.redirect("/logout");
			});
		}
	},

	createMessage : {
		handler : function (request, reply) {
			var member = request.params.member;
			console.log( 'In createMessages, member: ' + member );

			//var recipient_user	= request.payload.recipient;
			var emailDetails = {
				emailtype: request.payload.emailtype2,
				email: request.payload.email,
				username: request.params.member,
				first_name: request.payload.firstname,
				last_name: request.payload.lastname,
				subject: request.payload.subject,
				contents: request.payload.contents
			};

			messages.sendEmail( emailDetails, emailDetails.emailtype, function ( error, message, body ) {
				if( error ){
					console.log( "Error sending " + emailDetails.subject + ": " + error );
					return reply.view( 'member', {user:emailDetails, alerts: [{ isError : true, alert: error }] });
				}
				else {
					return reply.view( 'member', {user: emailDetails, alerts: [{isSuccess: true, alert: body.message}]});
					//return reply.redirect("/admin/member/"+emailDetails.member);
				}
			});

		}
	}
};
