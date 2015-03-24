/* $lab:coverage:off$ */
var creds = require("./creds.json");

module.exports = {
	mongo : {
				dbuser : process.env.DBUSER || creds.database.user,
				dbpwd  : process.env.DBPWD || creds.database.pwd,
				dburl  : process.env.DBURL || creds.database.url
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
	},
	mailgunTest : {
		apiKey : process.env.MGAPIKEY || creds.mailgunTest.mgApiKey,
		domain : process.env.MGTESTDOMAIN || creds.mailgunTest.mgTestDomain,
		password : process.env.MGTESTPASSWORD || creds.mailgunTest.mgTestPassword,
		proxy 	: process.env.MGTESTPROXY || creds.mailgunTest.mgTestProxy,
		mailLists : process.env.MAILLISTS || creds.mailgunTest.mailLists

	},
	mailgunProd: {

	}
};

/* $lab:coverage:on$ */
