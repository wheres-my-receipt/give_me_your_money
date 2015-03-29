var mongoose 	= require("mongoose");
var moment 		= require("moment");
var schema 		= require("./schema.js");
var Account 	= schema.Account;
var DeskRental  = schema.DeskRental;


// sample params: 	{ 	query: {'username': 'foo'},
// 		optional ----->	filter: {'email': 1, '_id': 0}
// 					}
exports.search = function(params, onComplete) {

	if (params.filter) {
		Account.find(params.query, params.filter, function(err, result){
			if (err) {
				return onComplete(err);
			}
			return onComplete(null, result);
		});
	}
	else {
		Account.find(params.query, function(err, result){
			if (err) {
				return onComplete(err);
			}
			return onComplete(null, result);
		});
	}
};

exports.getAccounts = function(onComplete) {

	Account.find({}, function(err, result) {
		if (err) {
			return onComplete(err);
		}
		return onComplete(null, result);
	});
};

// Single account operations
exports.getAccount = function(username, onComplete) {
	Account.findOne({username : username}, function(err, result) {
		if (err) {
			console.log(err);
			return onComplete(err);
		}
		return onComplete(null, result);
	});
};

exports.updateAccount = function(username, updateObject, onComplete) {

// Need to set it so that on desk authorization, all months prior to 'now' are set as away.
	Account.findOneAndUpdate({username : username}, updateObject, function(err, result) {
		if (err) {
			return onComplete(err);
		}
		return onComplete(null, result);
	});
};

exports.createAccount = function(accountToCreate, onComplete) {

	var newAccount = new Account(accountToCreate);
	var sinceYear = newAccount.member_since.getFullYear();
	var sinceMonth = newAccount.member_since.getMonth();
	var i;

	newAccount.desk_rental_status[sinceYear] = new DeskRental();

	for (i = 0; i < sinceMonth; i++) {
		newAccount.desk_rental_status[sinceYear][i] = "away";
	}

	newAccount.save(function(err, result) {
		if (err) {
			return onComplete(err);
		}
		return onComplete(null, result);
	});
};

exports.deleteAccount = function(username, onComplete) {

	Account.findOneAndRemove({username : username}, function(err, result) {
		if (err) {
			return onComplete(err);
		}
		return onComplete(null, result);
	});
};

// Payment operations
exports.newTransaction = function(username, transaction, onComplete) {

	Account.findOne({username: username}, function(err, result) {
		if(err) {
			return onComplete(err);
		}
		var now 		 = new Date(+transaction.date);
		var currentYear  = now.getFullYear();
		var oldPaidUntil = result.membership_paid;
		var currentMonth = now.getMonth();

		if (transaction.type === "membership") {
			result.membership_active_status = true;
			result.automated_emails.membership_reminder_sent = false;
			result.automated_emails.membership_demand_sent = false;
			result.automated_emails.membership_overdue_sent = false;

			if (!oldPaidUntil) {
				result.membership_paid = now.setFullYear(currentYear + 1);
			} else if (oldPaidUntil < now) {
				result.membership_paid = now.setFullYear(currentYear + 1);
			} else {
				// set the new 'paid until' to the old
				var oldYear = oldPaidUntil.getFullYear();
				result.membership_paid = oldPaidUntil.setFullYear(oldYear + 1);
				result.markModified('membership_paid');
			}

		} else if (transaction.type === "desk") {

			var deskHistory = result.desk_rental_status;
			var deskRentalChanger = function (status, year, month) {
				if (!deskHistory[year]) {
					result.desk_rental_status[year] = new DeskRental();
				} else if (deskHistory[year][month] === "paid") {
					return onComplete("already paid m8");
				}
				result.desk_rental_status[year][month] = status;
				result.markModified('desk_rental_status');
			};

			deskRentalChanger("paid", currentYear, currentMonth);
		}

		result.transaction_history.push(transaction);
		result.save(function(err, success) {
			if(err) {
				return onComplete(err);
			}
			return onComplete(null, success);
		});
	});
};

exports.changeDeskStatus = function(username, status, month, year, onComplete) {
	
	Account.findOne({username: username}, function(err, result) {
		if(err) return onComplete(err);

		if (!result.desk_rental_status[year]) {
				result.desk_rental_status[year] = new DeskRental();
		} else if (result.desk_rental_status[year][month] === "paid") {
			return onComplete("You have already paid for this month");
		}
		result.desk_rental_status[year][month] = status;
		result.markModified('desk_rental_status');
		result.save(function(err, success) {
			if (err) return onComplete(err);
			else return onComplete(null, success);
		});
	});
};

// Message operations
// EXPECTS: emaildetails.email/subject/contents
exports.newMessage = function(username, emailDetails, onComplete) {
	Account.findOne({username: username}, function(err, result) {

		if(err) {
			return onComplete(err);
		}
		var messageObject = {
			to: emailDetails.to,
			from: 'facmembershipadmin@gmail.com',
			date: new Date(),
			subject: emailDetails.subject ,
			text: emailDetails.text
		};
		var index = result.message_history.length;
		result.message_history.push(messageObject);

		result.save(function(err, saveresult) {
			if(err) {
				console.log( 'error in save:' + err);
				return onComplete(err);
			}

			console.log( 'Message added to message_history: ' + result.message_history[ index ]);

			return onComplete(null, result, result.message_history[ index ].id);
		});
	});
};

exports.deleteMessage = function(username, messageId, onComplete ) {
	console.log( "Delete Message: " + messageId + " for " + username);
	Account.findOne({username: username}, function(err, result) {

		if(err) {
			return onComplete(err);
		}
		var count_before_delete = result.message_history.length;
		var foundMessage=false;
		var messages_minus_deleted = result.message_history.filter( function( elem, index ) {
			// console.log( "element id: " + elem.id );
			// console.log( "messageId: " + messageId);
			// console.log( "type of element id: " + typeof(elem.id) );
			// console.log( "type of messageId: " + typeof( messageId));
			if( elem.id===messageId ) {
				console.log( 'Message found to delete!');
				foundMessage = true;
			}
			return( !elem._id.equals(messageId ));
		});
		if( foundMessage && count_before_delete === messages_minus_deleted.length ) {
			// If these two arrays are the same length then we failed to remove the message
			return onComplete( "Message delete failed on ID: " + messageId );
		}
		result.message_history = messages_minus_deleted;
		result.save( function( error, result ) {
			if (error) {
				return onComplete( error );
			}

			return onComplete( null, result );
		});
	});
};

