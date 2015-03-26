var mongoose 	= require("mongoose");
var moment 		= require("moment");
var schema 		= require("./schema.js");
var Account 	= schema.Account;
var DeskRental  = schema.DeskRental;


// sample params: 	{ 	query: {'username': 'foo'},
// 		optional ----->	filter: {'email': 1, '_id': 0}
// 					}
exports.search  = function(params, onComplete) {

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
		var now = new Date(+transaction.date);
		var currentYear = now.getFullYear();
		var oldPaid 	= result.membership_paid;

		if (transaction.type === "membership") {
			result.membership_active_status = true;
			if (!oldPaid) {
				result.membership_paid = now.setFullYear(currentYear + 1);
			} else {
				result.membership_paid = oldPaid.setFullYear((oldPaid.getFullYear()) + 1);
			}
			console.log(result.membership_paid);
		}
		else if (transaction.type === "desk") {

			var deskHistory = result.desk_rental_status;
			var currentMonth = now.getMonth();

			if (!deskHistory[currentYear]) {
				deskHistory[currentYear] = new DeskRental();
			} else if (deskHistory[currentYear][currentMonth] === "paid") {
				return onComplete("already paid m8");
			}
			deskHistory[currentYear][currentMonth] = "paid";
		}

		result.transaction_history.push(transaction);
		console.log(result);
		result.save(function(err, success) {
			if(err) {
				console.log("save err", err);
				return onComplete(err);
			}
			return onComplete(null, success);
		});
	});

};

// Message operations
exports.newMessage = function(username, emailDetails, onComplete) {
	console.log( "new message : " +username);
	Account.findOne({username: username}, function(err, result) {
		console.log( "new message - findOne");

		if(err) {
			return onComplete(err);
		}
		var messageObject = {
			to: emailDetails.email,
			from: 'facmembershipadmin@gmail.com',
			date: moment().format('MMMM Do YYYY'),
			subject: emailDetails.subject ,
			contents: emailDetails.contents
		};
		result.message_history.push(messageObject);

		result.save(function(err, result) {
			if(err) {
				return onComplete(err);
			}
			return onComplete(null, result);
		});
	});

};
