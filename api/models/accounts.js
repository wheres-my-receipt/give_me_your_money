var mongoose 	= require("mongoose");
var moment 		= require("moment");
var schema 		= require("./schema.js");
var Account 	= schema.Account;
var DeskRental  = schema.DeskRental;

// Multiple account operations
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
// TBDONE
		var now = new Date(+transaction.date);

		if (transaction.type === "membership") {
			result.membership_active_status = true;
			result.membership_paid = now;
		}
		else if (transaction.type === "desk") {

			var deskHistory = result.desk_rental_status;
			var currentYear = now.getYear();
			var currentMonth = now.getMonth();

			if (!deskHistory[currentYear]) {
				deskHistory[currentYear] = new DeskRental();
			} else if (deskHistory[currentYear][currentMonth] === "paid") {
				return onComplete(err);
			}
			deskHistory[currentYear][currentMonth] = "paid";
		}

		result.transaction_history.push(transaction);
		result.save(function(err, result) {
			if(err) {
				return onComplete(err);
			}
			return onComplete(null, result);
		});
	});

};

// Message operations
exports.newMessage = function(username, message, onComplete) {
	console.log( "new message : " +username);
	Account.findOne({username: username}, function(err, result) {
		console.log( "new message - findOne");

		if(err) {
			return onComplete(err);
		}

		result.message_history.push(message);

		result.save(function(err, result) {
			if(err) {
				return onComplete(err);
			}
			return onComplete(null, result);
		});
	});

};
