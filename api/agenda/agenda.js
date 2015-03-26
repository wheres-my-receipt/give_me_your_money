var moment = require('moment');

exports.agendaStart = function() {

	var config = require('../config');
	var Agenda = require('agenda');
	var agenda = new Agenda({db: { address: 'mongodb://' +config.mongo.dbuser + ':' + config.mongo.dbpwd + "@" + config.mongo.dburl}});

	// var test = require('./test');
	// test.test(agenda);
	// agenda.every('10 seconds', 'helloWorld');

	var annual = require('./annual');

	annual.testReminder(agenda);
	agenda.now('testReminder');

	// annual.annualReminder(agenda);
	// agenda.every('one day', 'annualReminder');

	// annual.annualDemand(agenda);
	// agenda.every('one day', 'annualDemand');

	// annual.annualOverdue(agenda);
	// agenda.every('one day', 'annualOverdue');

	var desk = require('./desk');

	// desk.deskReminder(agenda);
	// agenda.every('one day', 'deskReminder');



	agenda.start();
	console.log('Agenda tasks running');
};
