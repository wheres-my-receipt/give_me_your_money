var db = require('../models/accounts');
var moment = require('moment');
var messages = require('../messages/messages');

function annualReminder(agenda) {
	// sends reminder 1 week before expiration of annual membership
	agenda.define('annualReminder', function(job, done){
		var reminderTime = moment().subtract(1,'years').add(1,'weeks').toDate();
		db.search({query: {'membership_paid': {'$lt': reminderTime }} }, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				result.forEach(function(user, index){
					if (!user.membership_reminder_sent) {
						messages.sendEmailRefactor(user, "annualSubscriptionReminder", function( error, data ) {
							if( err ) {
								console.log( "Annual sub reminder email error: " + error );
								if (index === result.length - 1) {
									done();
								}
							}
							else {
								db.updateAccount(user.username, {'membership_reminder_sent': true}, function(err2, result){
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
		});
	});
}

function annualDemand(agenda) {
	// sends request for payment one year after last paying annual membership
	agenda.define('annualDemand', function(job, done){
		var reminderTime = moment().subtract(1,'years').toDate();
		db.search({query: {'membership_paid': {'$lt': reminderTime }} }, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				result.forEach(function(user, index){
					if (!user.membership_demand_sent) {
						messages.sendEmailRefactor(user, "annualSubscriptionDemand", function( error, data ) {
							if( err ) {
								console.log( "Annual sub demand email error: " + error );
								if (index === result.length - 1) {
									done();
								}
							}
							else {
								db.updateAccount(user.username, {'membership_demand_sent': true}, function(err2, result){
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
		});
	});
}

function annualOverdue(agenda) {
	// sends request for payment one year after last paying annual membership
	agenda.define('annualOverdue', function(job, done){
		var reminderTime = moment().subtract(1,'years').subtract(1, 'weeks').toDate();
		db.search({query: {'membership_paid': {'$lt': reminderTime }} }, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				result.forEach(function(user, index){
					if (!user.membership_overdue_sent) {
						messages.sendEmailRefactor(user, "annualSubscriptionOverdue", function( error, data ) {
							if( err ) {
								console.log( "Annual sub demand email error: " + error );
								if (index === result.length - 1) {
									done();
								}
							}
							else {
								db.updateAccount(user.username, {'membership_overdue_sent': true}, function(err2, result){
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
				result.forEach(function(user, index){
					if (true) {
						messages.sendEmailRefactor(user, "annualSubscriptionOverdue", function( error, data ) {
							if( err ) {
								console.log( "Annual sub reminder email error: " + error );
								if (index === result.length - 1) {
									done();
								}
							}
							else {
								db.updateAccount(user.username, {'membership_reminder_sent': true}, function(err2, result){
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
		});
	});
}

module.exports = {
	annualReminder: annualReminder,
	annualDemand: annualDemand,
	annualOverdue: annualOverdue,
	testReminder: testReminder
};
