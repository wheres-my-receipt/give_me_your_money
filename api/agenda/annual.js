var db = require('../models/accounts');
var moment = require('moment');
var messages = require('../messages/messages');

function annualReminder(agenda) {
	// sends reminder 1 week before expiration of annual membership
	agenda.define('annualReminder', function(job, done){
		var reminderTime = moment().add(1,'weeks').toDate();
		db.search({query: {'membership_paid': {'$lt': reminderTime }} }, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				if (result) {
					result.forEach(function(user, index){
						if (!user.automated_emails.membership_reminder_sent) {
							messages.sendEmail(user, "AnnualSubscriptionReminder", function( error, data ) {
								if( err ) {
									console.log( "Annual sub reminder email error: " + error );
									if (index === result.length - 1) {
										done();
									}
								}
								else {
									db.updateAccount(user.username, {'automated_emails.membership_reminder_sent': true}, function(err2, result2){
										if (err) console.log('Error registering annual reminder email sent status ', err2);
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
	});
}

function annualDemand(agenda) {
	// sends request for payment when annual membership expires
	agenda.define('annualDemand', function(job, done){
		var reminderTime = moment().toDate();
		db.search({query: {'membership_paid': {'$lt': reminderTime }} }, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				if (result) {
					result.forEach(function(user, index){
						// set user membership status to false
						db.updateAccount(user.username, {'membership_active_status': true}, function(err1, result1) {
							if (err1) console.log('Error setting members active status to false', err1);
							if (!user.automated_emails.membership_demand_sent) {
								messages.sendEmail(user, "AnnualSubscriptionDemand", function( error, data ) {
									if( err ) {
										console.log( "Annual sub demand email error: " + error );
										if (index === result.length - 1) {
											done();
										}
									}
									else {
										db.updateAccount(user.username, {'automated_emails.membership_demand_sent': true}, function(err2, result2){
											if (err) console.log('Error registering annual demand email sent status ', err2);
											if (index === result.length - 1) {
												done();
											}
										});
									}
								});
							}
						});
					});
				}
			}
		});
	});
}

function annualOverdue(agenda) {
	// sends reminder one weeek after membership expires
	agenda.define('annualOverdue', function(job, done){
		var reminderTime = moment().subtract(1, 'weeks').toDate();
		db.search({query: {'membership_paid': {'$lt': reminderTime }} }, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				if (result) {
					result.forEach(function(user, index){
						if (!user.automated_emails.membership_overdue_sent) {
							messages.sendEmail(user, "AnnualSubscriptionOverdue", function( error, data ) {
								if( err ) {
									console.log( "Annual sub demand email error: " + error );
									if (result.length - 1) {
										done();
									}
								}
								else {
									db.updateAccount(user.username, {'automated_emails.membership_overdue_sent': true}, function(err2, result2){
										if (err) console.log('Error registering annual demand email sent status ', err2);
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
	});
}

function testReminder(agenda){
	agenda.define('testReminder', function(job, done){
		var testTime = moment().toDate();
		db.search({query: {'member_since': {'$lt': testTime }} }, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				if (result) {
					result.forEach(function(user, index){
						if (!user.automated_emails.test_sent) {
							messages.sendEmail(user, "AnnualSubscriptionReminder", function( error, data ) {
								if( err ) {
									console.log( "Annual sub reminder email error: " + error );
									if (index === result.length - 1) {
										done();
									}
								}
								else {
									db.updateAccount(user.username, { 'automated_emails.test_sent': true}, function(err2, result2){
										if (err) console.log('Error registering annual reminder email sent status ', err2);
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
	});
}

module.exports = {
	annualReminder: annualReminder,
	annualDemand: annualDemand,
	annualOverdue: annualOverdue,
	testReminder: testReminder
};
