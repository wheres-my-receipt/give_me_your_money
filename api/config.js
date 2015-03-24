/* $lab:coverage:off$ */
var creds = require("./creds.json");

module.exports = {
	mongo : {
				dbuser : process.env.DBUSER || creds.database.user,
				dbpwd  : process.env.DBPWD || creds.database.pwd,
				dburl  : process.env.DBURL || creds.database.url
	},
	github : {
				secret 	: process.env.SECRET || creds.github.password,
				cKey	: process.env.CKEY || creds.github.clientId,
				cSecret	: process.env.CSECRET || creds.github.clientSecret,
	},
	twitter : {
				secret 	: process.env.SECRET || creds.twitter.secret,
				cKey	: process.env.CKEY || creds.twitter.cKey,
				cSecret	: process.env.CSECRET || creds.twitter.cSecret,
	},
	cookie : {
				password: process.env.COOKIESECRET || creds.cookieSecret
	},
	stripe : {
				sk : process.env.STRIPESECRET || creds.stripe.secret
	}
};

/* $lab:coverage:on$ */
