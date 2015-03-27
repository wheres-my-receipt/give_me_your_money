var moment = require('moment');

function agendaStop(agenda) {
	function graceful() {
	  agenda.stop(function() {
	    console.log('Gracefully terminating agenda');
	    process.exit(0);
	  });
	}

	process.on('SIGTERM', graceful);
	process.on('SIGINT' , graceful);
}

function agendaStart(){

	var config = require('../config');
	var Agenda = require('agenda');
	var agenda = new Agenda({db: { address: 'mongodb://' +config.mongo.dbuser + ':' + config.mongo.dbpwd + "@" + config.mongo.dburl}});

	// Schedule subscription tasks
	var annual = require('./annual');

	// annual.testReminder(agenda);
	// agenda.now('testReminder');

	annual.annualReminder(agenda);
	agenda.every('one day', 'annualReminder');

	annual.annualDemand(agenda);
	agenda.every('one day', 'annualDemand');

	annual.annualOverdue(agenda);
	agenda.every('one day', 'annualOverdue');

	// Schedule desk rental tasks
	var desk = require('./desk');

	desk.deskUnpaid(agenda);
	agenda.every('one day', 'deskUnpaid');

	desk.deskOverdue(agenda);
	agenda.every('one day', 'deskOverdue');

	desk.deskClearBools(agenda);
	agenda.every('one day', 'deskClearBools');

	// Set up agenda task
	agendaStop(agenda);

	agenda.start();
	console.log('Agenda tasks running');
}

module.exports = {
	agendaStart: agendaStart,
	agendaStop: agendaStop
};
