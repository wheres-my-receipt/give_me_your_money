/* $lab:coverage:off$ */

module.exports = {
	mongo : {
				dbuser : process.env.DBUSER || require('./creds.json').dbuser,
				dbpwd  : process.env.DBPWD || require('./creds.json').dbpwd,
				dburl  : process.env.DBURL || require('./creds.json').dburl
	},
	github : {
				secret 	: process.env.SECRET || require('./creds.json').secret,
				cKey	: process.env.CKEY || require('./creds.json').cKey,
				cSecret	: process.env.CSECRET || require('./creds.json').cSecret,
	},

	cookie : {
		password: process.env.COOKIESECRET || require('./creds.json').cookieSecret
	}

};

/* $lab:coverage:on$ */
