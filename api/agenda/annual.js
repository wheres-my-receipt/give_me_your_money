var db = require('../models/accounts');
var moment = require('moment');
var messages = require('../messages/messages');

function annualReminder(agenda) {

	// sends reminder 1 week before expiration of annual membership
	agenda.define('annualReminder', function(job, done){
		var reminderTime = moment().subtract(1,'years').add(1,'weeks').toDate();
		db.search({'membership_paid': {'$lt': reminderTime }}, function(err, result){
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
								db.updateAccount(user.username, {'membership_reminder_sent': true}, function(err, result){
									if (err) console.log('Error registering annual reminder email sent status ',err);
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
		db.search({'member_since': {'$lt': testTime }}, function(err, result){
			if (err) {
				console.log(err);
				done();
			}
			else {
				result.forEach(function(user, index){
					if (true) {
						messages.sendEmailRefactor(user, "annualSubscriptionReminder", function( error, data ) {
							if( err ) {
								console.log( "Annual sub reminder email error: " + error );
								if (index === result.length - 1) {
									done();
								}
							}
							else {
								db.updateAccount(user.username, {'membership_reminder_sent': true}, function(err, result){
									if (err) console.log('Error registering annual reminder email sent status ',err);
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
	testReminder: testReminder
};
