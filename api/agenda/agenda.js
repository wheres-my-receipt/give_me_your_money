exports.agendaStart = function() {

	var config = require('../config');
	var Agenda = require('agenda');
	var agenda = new Agenda({db: { address: 'mongodb://' +config.mongo.dbuser + ':' + config.mongo.dbpwd + "@" + config.mongo.dburl}});

	var test = require('./test');
	// test.test(agenda);

	var annual = require('./annual');
	// annual.annualReminder(agenda);
	annual.testReminder(agenda);

	agenda.now('testReminder');
	// agenda.every('10 seconds', 'annualReminder');
	// agenda.every('10 seconds', 'helloWorld');

	agenda.start();
	console.log('Agenda tasks running');
};
