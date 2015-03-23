var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");

// User testing
lab.experiment("when the user visits the signup page, ", function() {

	lab.test("Without proper authentication", function(done) {

		options = {
			method: "GET",
			url: "/signup"
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, " they should get a FOUND status code (302)");
			assert.equal(response.headers.location, "/", " they should be redirected to the login page");
			done();
		});
	});

	lab.test("with proper authentication, they should be able to register as a user", function(done) {

		options = {
			method: "GET",
			url: "/signup",
			credentials: {
				name: 	"timmy tester",
				status: "sith lord"
			}
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
			assert.includes(response.headers["Content-Type"], "text/html", "they should get an html page back");
			assert.includes(response.result, "<form", "they should be presented with a form element");
			done();
		});
	});

});

lab.experiment("When visits the home page, ", function() {

	lab.test("without proper authentication, they should be asked to log in", function(done) {

	});

	lab.test("with proper authentication, they should be redirected to their account page", function(done) {

	});
});

lab.experiment("When the user visits the account page, ", function() {
	lab.test("They should be able to change their active/inactive status", function(done) {

	});
});

lab.experiment("When the user make a membership payment, ", function() {
	lab.test("the details should be stored in the database", function(done) {

	});
});

lab.experiment("When a user tries to visit the admin page, ", function() {
	lab.test("they should be ruthlessly evacuated from the premises", function(done) {

	});
});

lab.experiment("When the admin visits the admin dashboard, ", function() {
	lab.test("they should be able to see a list of members, their status in the space, and their monthly rent", function(done) {

	});
	lab.test("they should be able to email an individual or group", function(done) {

	});
	lab.test("they should be able to authorise new members, ", function(done) {

	});
});

// Testing the endpoints
lab.experiment("Testing the JSON API 1: ", function() {

	lab.test("Sending a get request to /account", function(done) {

	});

	lab.test("Sending a put/post request to /account", function(done) {

	});

	lab.test("Sending a get request to /accounts", function(done) {

	});

	lab.test("Sending a post request to /accounts", function(done) {

	});

	lab.test("Sending a get request to /accounts/{member}", function(done) {

	});

	lab.test("Sending a put request to /accounts/{member}", function(done) {

	});

	lab.test("Sending a delete request to /accounts/{member}", function(done) {

	});
});

lab.experiment("Testing the JSON API 2: ", function() {});
