var mongoose 	= require("mongoose");
var Account 	= require("./schema.js").Account;

// Multiple account operations
exports.getAccounts = function(callback) {
	Account.find({}, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};

// Single account operations
exports.getAccount = function(username, callback) {
	Account.find({username : username}, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};

exports.updateAccount = function(username, updateObject, callback) {
	Account.findOneAndUpdate({username : username}, updateObject, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};

exports.createAccount = function(accountToCreate, callback) {

	var newAccount = new Account(accountToCreate);

	newAccount.save(function(err, result) {
		if (err) {
			console.log(err);
			return callback(err);
		}
		console.log(result);
		return callback(null, result);
	});
};

exports.deleteAccount = function(username, callback) {
	Account.findOneAndRemove({username : username}, function(err, result) {
		console.log(err, result);
		if (err) {
			return callback(err);
		}
		console.log("success");
		return callback(null, result);
	});
};
