/* $lab:coverage:off$ */

module.exports = {
	mongo : {
				dbuser : process.env.DBUSER || require('./creds.json').dbuser,
				dbpwd : process.env.DBPWD || require('./creds.json').dbpwd,
				dburl : process.env.DBURL || require('./creds.json').dburl
			},
	github: {
		password: 'githubsecret',
		clientId: 'sommit',
		clientSecret: 'sommitelse'
	},
	cookie : {
		password: 'cookiesecret'
	}
};

/* $lab:coverage:on$ */
