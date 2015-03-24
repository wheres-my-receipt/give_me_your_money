var mongoose 	= require("mongoose");
var config 		= require("../config.js").mongo;
var account 	= require("./schema.js").account;

var mongodbUri = "mongodb://" + config.dbuser + ":" + config.dbpwd + config.dburl;

// Multiple account operations
exports.getAccounts = function(callback) {
	account.find({}, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};

// Single account operations
exports.getAccount = function(username, callback) {
	account.find({username : username}, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};

exports.updateAccount = function(username, updateObject, callback) {
	account.findOneAndUpdate({username : username}, updateObject, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};

exports.createAccount = function(newAccount, callback) {
	account.save(newAccount, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};

exports.deleteAccount = function(username, callback) {
	account.findOneAndRemove({username : username}, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, result);
	});
};
