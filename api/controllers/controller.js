var Bell 	 = require("bell");
var path 	 = require("path");
var Joi 	 = require("joi");
var moment 	 = require("moment");
var stripe 	 = require("stripe")(require("../config.js").stripe.sk);
var config 	 = require('../config.js');
var accounts = require("../models/accounts.js");
var messages = require("../messages/messages.js");
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var creationValidation = Joi.object({
		email: Joi.string().email().required(),
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		phone_number: Joi.string().required().min(11).max(13)
	});

var updateValidation = Joi.object({
		email: Joi.string().email(),
		first_name: Joi.string(),
		last_name: Joi.string(),
		phone_number: Joi.string().min(11).max(13)
	}).or("email", "first_name", "last_name", "phone_number");

var updateDeskValidation = Joi.object({
	status: Joi.string().valid("unpaid", "paid", "away").required()
});

module.exports = {

	homeView: {
		auth: false,
		handler: function (request, reply ) {
			if(request.auth.isAuthenticated) {
				return request.auth.credentials.account ? reply.redirect("/account") : reply.redirect("/signup");
			}
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
					url 		: g.profile.raw.url,
					alerts 		: [],
					account 	: false
				};

				 accounts.getAccount( profile.username, function( err, result ){
					if (err) console.log(err);
					if (result) profile.account = true;

					request.auth.session.clear();
					request.auth.session.set(profile);

					return profile.account ? reply.redirect("/account") : reply.redirect("/signup");
				 });
			}
			else reply('Not logged in, should be forwarded to bell login...').code(401);
		}
	},

	logout: {
		handler: function (request, reply ){
			request.auth.session.clear();
			return reply.redirect('/');
		}
	},

	signupView: {
		handler: function (request, reply){
			return request.auth.credentials.account ? reply.redirect("/account") : reply.view("signup", {user : request.auth.credentials});
		}
	},

	accountView: {
		handler: function (request, reply) {
			if (!request.auth.credentials.account) {
				return reply.redirect("/signup");
			}
			console.log(request.auth.credentials);
			var userToFind = request.auth.credentials.username;
			var alerts = request.auth.credentials.alerts;
			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			var today = new Date();
			var thisMonth = today.getMonth();
			console.log( 'Account view, alerts: ' + JSON.stringify( alerts ));
			accounts.getAccount(userToFind, function(err, result) {
				// request.auth.session.alerts = [];
				request.auth.session.set("alerts", []);

				console.log( 'Account view, alerts cleared: ' + JSON.stringify( request.auth.credentials.alerts ));

				if (err) {
					console.log(err);
					return reply.view("account", { user: undefined, alerts: [{isError: true, alert: "Error: " + err }], moment: moment});
				}
				return reply.view('account', {user: result, alerts: alerts, months: months, thisMonth: thisMonth, moment: moment});
			});
		}
	},

	messagesView: {
		handler: function (request, reply) {
			if (!request.auth.credentials.account) {
				return reply.redirect("/signup");
			}
			var userToFind = request.auth.credentials.username;
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
	},

	adminView: {
		handler: function (request, reply) {
			if (!request.auth.credentials.account) {
				return reply.redirect("/signup");
			}
			var userToFind = request.auth.credentials.username;
			var alerts = request.auth.credentials.alerts;
			console.log( 'Admin view, alerts: ' + JSON.stringify( alerts ));
			accounts.getAccount( userToFind, function (err, data ) {
				request.auth.session.set("alerts", []);
				console.log( 'Admin view, alerts: ' + request.auth.credentials.alerts);

				if(err) {
					return reply.view("admin_fail", { user: undefined, alerts: [{isError: true, alert: "Error: " + err }]});
				}
				if( !data ){
					return reply.view("admin_fail", { user: undefined, alerts: [{isError: true, alert: "No Account Data"}]});
				}
				// if user found has admin rights then allow them to view admin pages
				if( data.admin_rights){
					// get all members for display on admin 'landing page'
					accounts.getAccounts( function (err, members ) {
						return reply.view("admin", { user: data, members: members, mailLists: messages.getAllMailLists(), alerts: alerts });
					});
				}
				else {
					alerts.unshift( {isError: true, alert: "You do not have Administration Rights!"});
					return reply.view("admin_fail", { user: data, alerts: alerts });
				}
			});
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

			var paymentFor 		= request.params.type;
			var stripeToken		= request.payload.stripeToken;
			var accountToUpdate = request.auth.credentials.username;
			var alerts 			= request.auth.credentials.alerts;
			var newCharge;

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
					alerts.unshift( {isSuccess: true, alert: "Thank you, your payment has been taken."});
					messages.sendEmail(result, "PaymentReceipt", function( error, data ) {
						if( error ) {
							alerts.unshift({isError:true, alert: "Error sending payment receipt."});
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
						alerts.unshift( {isSuccess: true, alert: "Successfully Added To Transaction History" });
						request.auth.session.set("alerts", alerts);
						return reply.redirect("/account");
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
					return reply(err);
				}
				var today = new Date();
				var thisMonth = today.getMonth();
				return reply.view( 'member', {user :result, months: months, thisMonth: thisMonth, moment: moment });
			});
		}
	},

	updateMemberView: {
		handler: function (request, reply) {
			var userToUpdate = request.params.member;
			// var updateTheseFields = request.payload;
			// var alerts = request.auth.credentials.alerts;

			// if(userToUpdate !== request.auth.credentials.username && !request.auth.credentials.admin_rights) {
			// 	alerts.unshift({isError: true, alert: "You're not authorized to update that user's account"});
			// 	request.auth.session.set("alerts", alerts);
			// 	return reply.redirect("/admin");
			// }
			return request.server.methods.updateAccountHelper(request, reply, function( err, result) {
				console.log( 'Result: ' + JSON.stringify(result));
				var today = new Date();
				var thisMonth = today.getMonth();
				console.log( "Redirect to /admin/member/{user}");
				return reply.redirect( '/admin');///members' + userToUpdate);
			});
			// console.log( 'Request.server: ' + request.server );
			// request.server.inject({
			// 	method  : 'PUT',
			// 	url     : '/api/accounts/' + userToUpdate,
			// 	// headers : request.headers,
			// 	payload : updateTheseFields
			// }, function (result) {
			// 	console.log('Request: ' + JSON.stringify( result.raw.req));
			// 	console.log( 'Server inject: ' + result.statusCode);
			// 	console.log( 'Server inject: ' + result.payload);

			// 	var today = new Date();
			// 	var thisMonth = today.getMonth();
			// 	// return reply.view( 'member', {user :result, months: months, thisMonth: thisMonth, moment: moment });
			// 	return reply.redirect( '/admin/members' + userToUpdate);

			// });
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
			var user = request.payload;
			var username = request.auth.credentials.username;

			var accountToCreate = {

				email: user.email || request.auth.credentials.email,
				username: request.auth.credentials.username,
				first_name: user.first_name.split(" ").map(function(x) {return x[0].toUpperCase() + x.slice(1);}).join(" "),
				last_name: user.last_name.split(" ").map(function(x) {return x[0].toUpperCase() + x.slice(1);}).join(" "),
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
					return reply.view( 'signup', {user: undefined, alerts: [{isError: true, alert: err }]});
				}
				// add to all members email group and send ack email
				request.auth.session.set("account", true);
				messages.addToMembersList(accountToCreate);
				messages.sendEmail(accountToCreate, "Acknowledge", function( error, data ) {
					if( err ) {
						request.auth.session.set("alerts", [{isError:true, alert: "Error sending sign up confirmation"}]);
					}
					return reply.redirect("/account");
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

			// return request.server.methods.updateAccountHelper(request, reply, function( err, result) {
			// 	console.log( 'Result: ' + JSON.stringify(result));
			// 	var today = new Date();
			// 	var thisMonth = today.getMonth();
			// 	if (err) {
			// 		console.log( 'Error in updateAccountHelper: ' + err );
			// 	}
			// 	console.log( 'alerts: ' + request.auth.session.alerts);
			// 	console.log( "Redirect to /account");

			// 	return reply.redirect("/account");
			// });
			// updateAccountHelper( request, reply, function( err, result ) {
			// 	if (err) {
			// 		console.log( 'Error in updateAccountHelper: ' + err );
			// 	}
			// 	console.log( 'alerts: ' + request.auth.session.alerts);
			// 	return reply.redirect("/account");
			// });
			var userToUpdate = request.params.member;
			var updateTheseFields = request.payload;
			var alerts = request.auth.credentials.alerts;
			console.log( 'User: ' + userToUpdate );
			console.log( 'Fields to update: ' + JSON.stringify( updateTheseFields ));
			if(userToUpdate !== request.auth.credentials.username && !request.auth.credentials.admin_rights) {
				alerts.unshift({isError: true, alert: "You're not authorized to update that user's account"});
				request.auth.session.set("alerts", alerts);
				return reply.redirect("/account");
			}

			accounts.updateAccount(userToUpdate, updateTheseFields, function(err, result) {
				if (err) {
					// need to stick the alert+redirect setting block in a function
					alerts.unshift({isError: true, alert: "Error updating your account: " + err});
					request.auth.session.set("alerts", alerts);
					return reply.redirect("/account");
				}
				if (updateTheseFields.desk_authorization) {
					var forMailList = {
						email: result.email,
						first_name : result.first_name,
						last_name : result.last_name
					};
					messages.addToDeskOccupantsList( forMailList);
					messages.sendEmail(result, 'VerifyAccount', function(err){
						if (err) {
							console.log( 'Error sending email: ' + err );
							alerts.unshift({isError: true, alert: "Error updating your account: " + err});
							request.auth.session.set("alerts", alerts);
							return reply.redirect("/account");
						}
					});
				}
				if (updateTheseFields.admin_rights) {
					messages.sendEmail(result, 'AdminRights', function(err){
						if (err) {
							alerts.unshift({isError: true, alert: "Error updating your account: " + err});
							request.auth.session.set("alerts", alerts);
							return reply.redirect("/account");
						}
					});
				}
				console.log( 'After updateAccount:' + err + ' : ' + result );

				alerts.unshift({isSuccess: true, alert: "Account successfully updated"});
				request.auth.session.set("alerts", alerts);
				console.log( 'Alerts: ' + request.auth.session.alerts );
				return reply.redirect("/account");
			});
		}
	},

	updateAccountDesk: {
		validate:{
				payload: updateDeskValidation,
		},
		handler: function (request, reply) {

			var userToUpdate = request.params.member;
			var year = request.params.year;
			var month = request.params.month;
			var status = request.payload.status;
			var alerts = request.auth.credentials.alerts;

			if(userToUpdate !== request.auth.credentials.username && !request.auth.credentials.admin_rights) {
				alerts.unshift({isError: true, alert: "You're not authorized to update that user's account"});
				request.auth.session.set("alerts", alerts);
				return reply.redirect("/account");
			}

			accounts.changeDeskStatus(userToUpdate, status, month, year, function(err, result) {
				if (err) {
					alerts.unshift({isError: true, alert: "Error: " + err});
					console.log(err);
					request.auth.session.set("alerts", alerts);
				}
				return reply.redirect("/account");
			});
		}
	},

	deleteAccount: {
		handler: function (request, reply) {
			var userToDelete = request.params.member;
			var alerts = request.auth.credentials.alerts;

			if(userToDelete !== request.auth.credentials.username && !request.auth.credentials.admin_rights) {
				alerts.unshift({isError: true, alert: "You're not authorized to delete that user's account"});
				request.auth.session.set("alerts", alerts);
				return reply.redirect("/account");
			}

			accounts.deleteAccount(userToDelete, function(err, result) {
				if (err) {
					alerts.unshift({isError: true, alert: "Error deleting your account: " + err});
					request.auth.session.set("alerts", alerts);
					return reply.redirect("/account");
				}
				request.auth.session.set("account", false);
				return reply.redirect("/logout");
			});
		}
	},

	createMessage : {
		handler : function (request, reply) {
			var member = request.params.member;
			var today = new Date();
			var thisMonth = today.getMonth();
			var alerts = request.auth.credentials.alerts;
			//var recipient_user	= request.payload.recipient;
			var emailDetails = {
				emailtype: request.payload.emailtype,
				email: request.payload.email,
				username: request.params.member,
				first_name: request.payload.firstname,
				last_name: request.payload.lastname,
				subject: request.payload.subject,
				contents: request.payload.contents
			};

			messages.sendEmail( emailDetails, emailDetails.emailtype, function ( error, message, memberDocument, body ) {
				if( error ){
					console.log( "Error sending email: " + error);
					alerts.unshift({ isError : true, alert: error });
					request.auth.session.set("alerts", alerts);
					return reply.redirect("/admin");
					// return reply.view( 'member', {user: memberDocument, months: months, thisMonth: thisMonth, moment: moment, alerts: [] });
				}
				else {
					alerts.unshift({isSuccess: true, alert: body.message});
					request.auth.session.set("alerts", alerts );
					// return reply.view( 'member', {user: memberDocument, months: months, thisMonth: thisMonth, moment: moment, alerts: [{isSuccess: true, alert: body.message}]});
					return reply.redirect("/admin");
				}
			});

		}
	},

	// update helper functions
	updateAccountHelper: function (request, reply, onComplete) {

		var userToUpdate = request.params.member;
		var updateTheseFields = request.payload;
		var alerts = request.auth.credentials.alerts;
		console.log( 'User: ' + userToUpdate );
		console.log( 'Fields to update: ' + JSON.stringify( updateTheseFields ));
		if(userToUpdate !== request.auth.credentials.username && !request.auth.credentials.admin_rights) {
			alerts.unshift({isError: true, alert: "You're not authorized to update that user's account"});
			request.auth.session.set("alerts", alerts);
			// return reply.redirect("/account");
			return onComplete( "Error: You're not authorized to update user accounts");
		}

		accounts.updateAccount(userToUpdate, updateTheseFields, function(err, result) {
			if (err) {
				// need to stick the alert+redirect setting block in a function
				alerts.unshift({isError: true, alert: "Error updating your account: " + err});
				request.auth.session.set("alerts", alerts);
				//return reply.redirect("/account");
				return onComplete( err );
			}
			if (updateTheseFields.desk_authorization) {
				messages.sendEmail(result, 'VerifyAccount', function(err){
					if (err) {
						console.log( 'Error sending email: ' + err );
						alerts.unshift({isError: true, alert: "Error updating your account: " + err});
						request.auth.session.set("alerts", alerts);
						// return reply.redirect("/account");
						return onComplete( err );

					}
				});
			}
			if (updateTheseFields.admin_rights) {
				messages.sendEmail(result, 'AdminRights', function(err){
					if (err) {
						alerts.unshift({isError: true, alert: "Error updating your account: " + err});
						request.auth.session.set("alerts", alerts);
						// return reply.redirect("/account");
						return onComplete( err );
					}
				});
			}
			console.log( 'After updateAccount:' + err + ' : ' + result );

			alerts.unshift({isSuccess: true, alert: "Account successfully updated"});
			request.auth.session.set("alerts", alerts);
			// return reply.redirect("/account");
			return onComplete( err, result );
		});
	}
};
