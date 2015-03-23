/* $lab:coverage:off$ */
var creds = require("./creds.json");

module.exports = {
	mongo : {
				dbuser : process.env.DBUSER || creds.dbuser,
				dbpwd  : process.env.DBPWD || creds.dbpwd,
				dburl  : process.env.DBURL || creds.dburl
	},
	github : {
				secret 	: process.env.SECRET || creds.github.password,
				cKey	: process.env.CKEY || creds.github.clientId,
				cSecret	: process.env.CSECRET || creds.github.clientSecret,
	},
	cookie : {
				password: process.env.COOKIESECRET || creds.cookieSecret
	}
};

/* $lab:coverage:on$ */
