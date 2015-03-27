var db = require('../models/accounts');
var moment = require('moment');
var messages = require('../messages/messages');

function deskUnpaid(agenda) {
	// checks for unpaid status on the 1st of the month (and 2nd in case of failure)
	agenda.define('deskUnpaid', function(job, done){
		console.log('Attempting deskUnpaid');
		if (moment().date() === 1 || moment().date() === 2) {
			console.log('date correct');
			var month = moment().month();
			var year = moment().year();
			var deskQueryYear = 'desk_rental_status[year]: {$exists: false}';
			var deskQueryMonth = 'desk_rental_status.'+year+'.'+month+' = unpaid';
			// send reminder if desk_rental_status for year missing, or if this month = 'unpaid'
			db.search({query: { $or: [
				{ $and: [ deskQueryYear, {desk_authorization: true} ]},
				{ $and: [ deskQueryMonth, {desk_authorization: true} ]}
			]}}, function(err, result){
				if (err) {
					console.log(err);
					done();
				}
				else {
					if (result) {
						result.forEach(function(user, index){
							if (!user.automated_emails.desk_unpaid_sent) {
								messages.sendEmail(user, "DeskRentalUnpaid", function( error, data ) {
									if( err ) {
										console.log( "Desk rental unpaid email error: " + error );
										if (index === result.length - 1) {
											done();
										}
									}
									else {
										db.updateAccount(user.username, {'automated_emails.desk_unpaid_sent': true}, function(err2, result2){
											if (err) console.log('Error registering desk rental upaid sent status ', err2);
											if (index === result.length - 1) {
												done();
											}
										});
									}
								});
							}
						});
					}
				}
			});
		}
	});
}

function deskOverdue(agenda) {

	// checks for unpaid status on the 15th (and 16th in case of failure) of the month
	agenda.define('deskOverdue', function(job, done){
		console.log('Attempting deskUnpaid');
		if (moment().date() === 15 || moment().date() === 16) {
			console.log('date correct');
			var month = moment().month();
			var year = moment().year();
			var deskQueryYear = 'desk_rental_status[year]: {$exists: false}';
			var deskQueryMonth = 'desk_rental_status.'+year+'.'+month+' = unpaid';
			// send reminder if desk_rental_status for year missing, or if this month = 'unpaid'
			db.search({query: { $or: [
				{ $and: [ deskQueryYear, {desk_authorization: true} ]},
				{ $and: [ deskQueryMonth, {desk_authorization: true} ]}
			]}}, function(err, result){
				if (err) {
					console.log(err);
					done();
				}
				else {
					if (result) {
						result.forEach(function(user, index){
							if (!user.automated_emails.desk_overdue_sent) {
								messages.sendEmail(user, "DeskRentalOverdue", function( error, data ) {
									if( err ) {
										console.log( "Desk rental unpaid email error: " + error );
										if (index === result.length - 1) {
											done();
										}
									}
									else {
										db.updateAccount(user.username, {'automated_emails.desk_overdue_sent': true}, function(err2, result2){
											if (err) console.log('Error registering desk rental overdue sent status ', err2);
											if (index === result.length - 1) {
												done();
											}
										});
									}
								});
							}
						});
					}
				}
			});
		}
	});
}

function deskClearBools(agenda) {
	// clears the desk reminder bools in advance of next months email cycle
	console.log('Attempting deskClearBools');
	agenda.define('deskClearBools', function(job, done){
		console.log('Clearing desk rental bools');
		if (moment().date() === 25 || moment().date() === 26) {
			db.search({query: {} }, function(err, result){
				if (err) {
					console.log(err);
					done();
				}
				else {
					if (result) {
						result.forEach(function(user, index){
							user.automated_emails.desk_unpaid_sent = false;
							user.automated_emails.desk_overdue_sent = false;
							user.save(function(err2, success){
								if(err2) console.log('Error resetting desk rental bools', err2);
								if(index === result.length - 1) {
									done();
								}
							});
						});
					}
				}
			});
		}
	});
}

module.exports = {
	deskUnpaid: deskUnpaid,
	deskOverdue: deskOverdue,
	deskClearBools: deskClearBools
};



