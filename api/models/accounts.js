var mongoose 	= require("mongoose");
var Account 	= require("./schema.js").Account;
var moment 	 = require("moment");

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
		console.log(result);
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
