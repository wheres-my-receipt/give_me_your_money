var mongoose 	= require("mongoose");
var Account 	= require("./schema.js").Account;

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
	Account.find({username : username}, function(err, result) {
		if (err) {
			return onComplete(err);
		}
		return onComplete(null, result);
	});
};

exports.updateAccount = function(username, updateObject, onComplete) {
	Account.update({username : username}, updateObject, function(err, result) {
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
			console.log(err);
			return onComplete(err);
		}
		console.log(result);
		return onComplete(null, result);
	});
};

exports.deleteAccount = function(username, onComplete) {
	Account.remove({username : username}, function(err, result) {
		console.log(err, result);
		if (err) {
			return onComplete(err);
		}
		console.log("success");
		return onComplete(null, result);
	});
};

// Payment operations
exports.newTransaction = function(username, transaction, onComplete) {

	Account.findOne({username: username}, function(err, result) {
		console.log(result);
		if(err) {
			console.log(err);
			onComplete(err);
		}
		result.transaction_history.push(transaction);
		result.save(function(err, result) {
			if(err) {
				console.log(err);
				return onComplete(err);
			}
			return onComplete(null, result);
		});
	});

};
