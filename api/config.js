/* $lab:coverage:off$ */

module.exports = {
	mongo : {
				dbuser : process.env.DBUSER || require('./creds.json').dbuser,
				dbpwd : process.env.DBPWD || require('./creds.json').dbpwd,
				dburl : process.env.DBURL || require('./creds.json').dburl
			},
	github: {
		password: 'githubsecret',
		clientId: 'adf7befc4fc9249455db',
		clientSecret: '08556d92bc509ab90e654d859d6a4d9569c1ca49',
	},
	cookie : {
		password: 'cookiesecret'
	}
};

/* $lab:coverage:on$ */
