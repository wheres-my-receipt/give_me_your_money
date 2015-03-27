var db = require('../models/accounts');
var moment = require('moment');
var messages = require('../messages/messages');

// TODO:
// run these functions on e.g.1st/2nd/3rd, in case of of error? bool should prevent resend

function deskUnpaid(agenda) {
	// checks for unpaid status on the first of the month
	agenda.define('deskUnpaid', function(job, done){
		if (moment().date() === 1) {
			var month = moment().month();
			var year = moment().year();
			var deskQueryYear = {};
			deskQueryYear[desk_rental_status][year] = {'$exits': false};
			var deskQueryMonth = {};
			deskQueryMonth[desk_rental_status][year][month] = 'unpaid';
			// send reminder if desk_rental_status for year missing, or if this month = 'unpaid'
			db.search({query: { $or: [
				// QUERY ONE comma
				{ $and: [ deskQueryYear, {desk_authorization: true} ]},
				{ $and: [ deskQueryMonth, {desk_authorization: true} ]}
			]}}, function(err, result){
				if (err) {
					console.log(err);
					done();
				}
				else {
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
			});
		}
	});
}

function deskOverdue(agenda) {

	// checks for unpaid status on the 15th of the month
	agenda.define('deskOverdue', function(job, done){
		if (moment().date() === 15) {
			var month = moment().month();
			var year = moment().year();
			var deskQueryYear = {};
			deskQueryYear[desk_rental_status][year] = {'$exits': false};
			var deskQueryMonth = {};
			deskQueryMonth[desk_rental_status][year][month] = 'unpaid';
			// send reminder if desk_rental_status for year missing, or if this month = 'unpaid'
			db.search({query: { $or: [
				// QUERY ONE comma
				{ $and: [ deskQueryYear, {desk_authorization: true} ]},
				{ $and: [ deskQueryMonth, {desk_authorization: true} ]}
			]}}, function(err, result){
				if (err) {
					console.log(err);
					done();
				}
				else {
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
			});
		}
	});
}

function deskClearBools(agenda) {
	// clears the desk reminder bools in advance of next months email cycle
	agenda.define('deskClearBools', function(job, done){
		if (moment().date() === 25) {
			db.search({query: {} }, function(err, result){
				if (err) {
					console.log(err);
					done();
				}
				else {
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
			});
		}
	});
}

module.exports = {
	deskUnpaid: deskUnpaid,
	deskOverdue: deskOverdue,
	deskClearBools: deskClearBools
};



