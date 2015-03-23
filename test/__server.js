var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");
var server		= require("../api/server.js");

// User testing
lab.experiment("When a user visits the home page, ", function() {

	lab.test("without proper authentication, they should be asked to log in, ", function(done) {

		var options = {
			url 	: "/",
			method 	: "GET",
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, " they should get a FOUND status code (302)");
			assert.include(response.headers.location, "https://github.com/login/oauth", "they should be redirected to the login page");
			done();
		});
	});

	lab.test("with proper authentication, they should be redirected to their account page, ", function(done) {

		var options = {
			url 		: "/",
			method 		: "GET",
			credentials : {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				profile: {
					raw: {
						avatar 	: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
						url 	: "https://github.com/MIJOTHY"
					}
				}
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, " they should get a FOUND status code (302)");
			assert.ok(response.headers["set-cookie"], "their session should be set");
			assert.equal(response.headers.location, "/signup", "they should be redirected to the signup page");
			done();
		});
	});
});

lab.experiment("When a user visits the signup page, ", function() {

	lab.test("without proper authentication, ", function(done) {

		var options = {
			method: "GET",
			url: "/signup"
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, "they should get a FOUND status code (302)");
			assert.equal(response.headers.location, "/", "they should be redirected to the login page");
			done();
		});
	});

	lab.test("with proper authentication, they should be able to register as a user, ", function(done) {

		var options = {
			method: "GET",
			url: "/signup",
			credentials : {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
			assert.include(response.headers["Content-Type"], "text/html", "they should get an html page back");
			assert.include(response.result, "<form", "they should be returned a form element");
			done();
		});
	});
});

lab.experiment("When the user visits the logout page, ", function() {

	lab.test("without proper authentication, ", function(done) {

		var options = {
			method: "GET",
			url: "/logout"
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, "they should get a FOUND status code (302)");
			assert.equal(response.headers.location, "/", "they should be redirected to the login page");
			done();
		});
	});

	lab.test("with proper authentication, they should be logged out, ", function(done) {

		var options = {
			method: "GET",
			url: "/logout",
			credentials : {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
			assert.include(response.headers["set-cookie"][0], "Expires=Thu, 01 Jan 1970 00:00:00 GMT", "their session should be cleared");
			done();
		});
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
lab.experiment("Testing the JSON API 1 - The User: ", function() {


	lab.test("Sending a GET request to /accounts", function(done) {

		var options = {
			url: "/accounts",
			method: "GET",
			credentials: {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a POST request to /accounts", function(done) {

		var options = {
			url: "/accounts",
			method: "POST",
			credentials: {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a GET request to /accounts/{member}, your own account", function(done) {

		var options = {
			url: "/accounts/bigboy1101",
			method: "GET",
			credentials: {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a PUT request to /accounts/{member}, your own account", function(done) {

		var options = {
			url: "/accounts/bigboy1101",
			method: "PUT",
			credentials: {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a DELETE request to /accounts/{member}, your own account", function(done) {
		var options = {
			url: "/accounts",
			method: "DELETE",
			credentials: {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});
});

lab.experiment("Testing the JSON API 2 - The Admin: ", function() {


	lab.test("Sending a GET request to /accounts", function(done) {

		var options = {
			url: "/accounts",
			method: "GET",
			credentials: {
				username 	: "Alice Admin",
				displayname	: "AliceTheUnaccountable202",
				email 		: "rollerblading12@pesto.net",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a POST request to /accounts", function(done) {

		var options = {
			url: "/accounts",
			method: "POST",
			credentials: {
				username 	: "Alice Admin",
				displayname	: "AliceTheUnaccountable202",
				email 		: "rollerblading12@pesto.net",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a GET request to /accounts/{member}, your own account", function(done) {

		var options = {
			url: "/accounts/bigboy1101",
			method: "GET",
			credentials: {
				username 	: "Alice Admin",
				displayname	: "AliceTheUnaccountable202",
				email 		: "rollerblading12@pesto.net",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a PUT request to /accounts/{member}, your own account", function(done) {

		var options = {
			url: "/accounts/bigboy1101",
			method: "PUT",
			credentials: {
				username 	: "Alice Admin",
				displayname	: "AliceTheUnaccountable202",
				email 		: "rollerblading12@pesto.net",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});

	lab.test("Sending a DELETE request to /accounts/{member}, your own account", function(done) {
		var options = {
			url: "/accounts",
			method: "DELETE",
			credentials: {
				username 	: "Alice Admin",
				displayname	: "AliceTheUnaccountable202",
				email 		: "rollerblading12@pesto.net",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			done();
		});
	});
});
