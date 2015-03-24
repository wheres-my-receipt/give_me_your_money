/* $lab:coverage:off$ */
var creds = require("./creds.json");

module.exports = {
	mongo : {
				dbuser : process.env.DBUSER || creds.database.dbuser,
				dbpwd  : process.env.DBPWD || creds.database.dbpwd,
				dburl  : process.env.DBURL || creds.database.dburl,
	},
	github : {
				secret 	: process.env.SECRET || creds.github.secret,
				cKey	: process.env.CKEY || creds.github.cKey,
				cSecret	: process.env.CSECRET || creds.github.cSecret,
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
