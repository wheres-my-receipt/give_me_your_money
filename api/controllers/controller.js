var Bell 	= require("bell");
var path 	= require("path");
var Stripe 	= require("stripe")(require("../config.js").stripe.sk);
var model 	= require("../models/members.js");
var config 	= require('../config.js');
var api_key = config.mailgunTest.apiKey;
var domain 	= config.mailgunTest.domain;
var port = {port: (process.env.port || 3000 ) };
//var proxy 	= config.mailgunTest.proxy + port;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var allMembersList = config.mailgunTest.mailLists.allMembersList;
var deskOccupantsList = config.mailgunTest.mailLists.deskOccupantsList;
var Joi 	= require("joi");
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
				// console.log( request.auth);

				request.auth.session.clear();
				// console.log( request.auth);
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
			// console.log( request.auth);

			request.auth.session.clear();

			// console.log( 'cleared session ' + request.auth );
			return reply.redirect('/');
		}
	},


	signup: {
		auth: {
			mode: 'optional'
		},
		handler: function (request, reply){
			if(request.auth.isAuthenticated) {
				return reply.file('signup.html');
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

	getAccount: {
		handler: function (request, reply) {
			return reply( "getAccount path");
		}
	},

	getAccounts: {
		handler: function(request, reply) {
			return reply("getAccounts path");
		}
	},
	createAccount: {
        // validate:{
        //         payload: joiSchema,
        // },
		handler: function (request, reply) {
			console.log( 'In createAccount');
			// == ADD NEW ACCOUNT MEMBER TO "all_members" EMAIL LIST
			var list = mailgun.lists(allMembersList);

			list.info(function (err, data) {
			  // `data` is mailing list info
			  if( err )
			  	console.log( "Error: " + err );
			  else
			  	console.log(data);
			});
			var newMember = {
  				subscribed: true,
  				address: request.payload.email,
  				name: request.payload.firstname + ' ' + request.payload.lastname
			};

			list.members().create(newMember, function (err, data) {
				// `data` is the member details
				if( err )
					console.log("Created Error: " + err);
				else
					console.log("Created: " + data);
				list.members().list(function (err, members) {
					if( err )
						console.log("Created Error: " + err);
					else// `members` is the list of members
						console.log("Members: " + members);
				});
			});
			// ==== SEND AN EMAIL ACKNOWLEDGEMENT TO NEW MEMBER == //
			var data = {
				from: 'facmembershipadmin@gmail.com',
				to: request.payload.email,
				subject: "Welcome to Founders & Coders!",
				text: "Hello " + request.payload.firstName + "! Thank you for joining Founders and Coders! We will be in touch to verify your account very shortly!"
			};

			mailgun.messages().send(data, function (error, body) {
				if( error ) {
					console.log( "Error: " + error );
				}
				else {
					console.log( "Sent email: " + body);
				}
			});
			return reply( "createAccount path");
		}
	},

	updateAccount: {
        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {
			return reply( "updateSingleMember path");
		}
	},

	deleteAccount: {
		handler: function (request, reply) {
			return reply( "deleteSingleAccount path");
		}
	}
};
