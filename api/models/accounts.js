var mongoose 	= require("mongoose");
var Account 	= require("./schema.js").Account;

// Multiple account operations

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
