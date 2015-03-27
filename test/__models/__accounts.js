var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");
var mongoose 	= require("mongoose");
var accounts 	= require("../../api/models/accounts.js");
var Mocks 		= require("../mocks/accountMocks.js");

lab.experiment("Database operations - the accounts file: ", function() {
	var database;

	lab.before(function(done) {
		mongoose.connect("mongodb://localhost:27017/test", function(err, db) {
			assert.isNull(err, "should connect to the local db without errors");
			// Populate the db with stuff
			database = mongoose.connection;
			done();
		});
	});

	lab.after(function(done) {
		database.close(function(err, db) {
			assert.isNull(err, "should disconnect from the local db without problems");
			done();
		});
	});

	lab.test("The search function", function(done) {
		var mockSearchQueryOK = {
			query: {"username": "TIMMY"}
		};
		var mockSearchQueryNotOK = {
			query: {"username": "SKIMMY"}
		};
		var mockSearchQueryERR = {
			query: {"poopername": "KIMMY"}
		};
		var mockSearchFilterOK = {
			query: {"username": "TIMMY"},
			filter: {"last_name": "farage"}
		};
		var mockSearchFilterNotOK = {
			query: {"username": "TIMMY"},
			filter: {"last_name": "Gandhi"}
		};
		var mockSearchFilterERR = {
			query: {"poopername": "TIMMY"},
			filter: {"latname": "Gandhi"}
		};
		var search = accounts.search;

		search(mockSearchQueryOK, function(err, result) {
			assert.isNull(err, "should not return an error with an OK search query");
			assert.lengthOf(result, 1, "should return one result");
			assert.equal(result[0].email, Mocks.vanilla.email, "should return us the correct object");
		});
		search(mockSearchQueryNotOK, function(err, result) {
			assert.isNull(err, "should not return an error with an OK search query");
			assert.lengthOf(result, 0, "should not return any results");
			assert.equal(result[0].email, Mocks.vanilla.email, "should return us the correct object");
		});
		search(mockSearchQueryERR, function(err, result) {
			assert.isOk(err, "should return an error with a dodgy search query");
			assert.lengthOf(result, 0, "should not return any results");
			assert.equal(result[0].email, Mocks.vanilla.email, "should return us the correct object");
		});
		search(mockSearchFilterOK, function(err, result) {
			assert.isNull(err, "should not return an error with an OK search query");
			assert.lengthOf(result, 1, "should return one result");
			assert.equal(result[0].email, Mocks.vanilla.email, "should return us the correct object");
		});
		search(mockSearchFilterNotOK, function(err, result) {
			assert.isNull(err, "should not return an error with an OK search query");
			assert.lengthOf(result, 1, "should return one result");
			assert.equal(result[0].email, Mocks.vanilla.email, "should return us the correct object");
		});
		search(mockSearchFilterERR, function(err, result) {
			assert.isNull(err, "should not return an error with an OK search query");
			assert.lengthOf(result, 1, "should return one result");
			assert.equal(result[0].email, Mocks.vanilla.email, "should return us the correct object");
		});
		done();
	});
	lab.test("The getAccounts function", function(done) {
		done();
	});
	lab.test("The getAccount function", function(done) {
		done();
	});
	lab.test("The updateAccount function", function(done) {
		done();
	});
	lab.test("The createAccount function", function(done) {
		done();
	});
	lab.test("The deleteAccount function", function(done) {
		done();
	});
	lab.test("The newTransaction function", function(done) {
		done();
	});
	lab.test("The newMessage function", function(done) {
		done();
	});
});
