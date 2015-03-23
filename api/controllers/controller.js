var Bell 	= require("bell");
var path 	= require("path");
var model 	= require("../models/members.js");
var Joi 	= require("joi");

var joiSchema = Joi.object().keys({ /* to be defined */});

module.exports = {

	// Static file handling
	home : {
		auth: {
			strategy: "github"
		},
		handler: function (request, reply) {
			var g = request.auth.credentials;
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

	statics: {
		auth: {
			strategy: "session"
		},
	    handler: {
	        directory: {
	            path: 'public'
	        }
	    }
	},

	// signup: {
	// 	auth: {
	// 		strategy: 'session'
	// 	},
	// 	handler: function (request, reply){
	// 		return reply.file('signup path');
	// 	}
	// },

	logout: {
		auth: {
			strategy: 'session'
		},
		handler: function (request, reply ){
			request.auth.session.clear();
			return reply( "logout path");
		}
	},

	// account: {
	// 	auth: {
 //        	strategy: 'session',
 //        },
	// 	handler: function (request, reply) {
	// 		return reply( "account path");
	// 	}
	// },

	// messages: {
	// 	auth: {
 //        	strategy: 'session',
 //        },
	// 	handler: function (request, reply) {
	// 		return reply( "messages path");
	// 	}
	// },

	// admin: {
	// 	auth: {
 //        	strategy: 'session',
 //        },
	// 	handler: function (request, reply) {
	// 		return reply( "admin path");
	// 	}
	// },

	// getMember: {
	// 	auth: {
 //        	strategy: 'session',
 //        },
	// 	handler: function (request, reply) {
	// 		return reply( "getMember path");
	// 	}
	// },

	// JSON API
	// /accounts
	getAccounts: {
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


	// /accounts/{member}
	getSingleAccount: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "getSingleAccount path");
		}
	},

	updateSingleAccount: {
		auth: {
        	strategy: 'session',
        },
        validate:{
                payload: joiSchema,
        },
		handler: function (request, reply) {
			return reply( "updateSingleMember path");
		}
	},

	deleteSingleAccount: {
		auth: {
        	strategy: 'session',
        },
		handler: function (request, reply) {
			return reply( "deleteSingleAccount path");
		}
	}
};
