var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");
var server		= require("../api/server.js");

// User testing
lab.experiment("When a user visits the home page, ", function() {

	lab.test("if not authenticated, they should see the home page, ", function(done) {

		var options = {
			url 	: "/",
			method 	: "GET",
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
			assert.include(response.payload, "href=\"/login\"", "there should be a button to direct them to login page");
			done();
		});
	});

	lab.test("if already authenticated, they should be redirected to their account page, ", function(done) {

		var options = {
			url 	: "/",
			method 	: "GET",
			credentials : {
				username 	: "Timmy Tester",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, " they should get a FOUND status code (302)");
			assert.include(response.headers.location, "https://github.com/login/oauth", "they should be redirected to the login page");
			done();
		});
	});
});

lab.experiment("When a user visits the login page", function() {

	lab.test("if already authenticated, they should be redirected to their account page, ", function(done) {

		var options = {
			url 		: "/login",
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
			assert.include(response.headers["content-type"], "text/html", "they should get an html page back");
			assert.include(response.result, "<form", "they should be returned a form element");
			assert.include(response.result, "method=\"POST\"", "they should be returned a form element that POSTs");
			assert.include(response.result, "action=\"/accounts\"", "they should be returned a form element pointed towards accounts");
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
			assert.equal(response.headers.location, "/", "they should be redirected to the home page");
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
			assert.equal(response.statusCode, 302, " they should get a FOUND status code (302)");
			assert.include(response.headers["set-cookie"][0], "Expires=Thu, 01 Jan 1970 00:00:00 GMT", "their session should be cleared");
			assert.equal(response.headers.location, "/", "they should be redirected to the home page");
			done();
		});
	});
});


lab.experiment("When the user visits the account page, ", function() {
	lab.test("They should be able to change their active/inactive status", function(done) {
		done();
	});
	lab.test("If they have just made a successful payment, a 'success' box should appear", function(done) {
		var options = {
			method: "GET",
			url: "/account/bigboy1101?payment=success",
			credentials : {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};
		done();
	});
});

// Testing payment
lab.experiment("When the user make a membership payment, ", function() {

	lab.test("on a card decline, the user should receive an error message", function(done) {

		var options = {
			url: 	"/payment",
			method: "POST",
			credentials: {
				name: "blahblah"
			},
			payload: {
				stripeToken: "badtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.message, "error", "that notifies them that there has been an error");
			assert.include(response.message, "card declined", "that outlines the error with adequate specificity");
			done();
		});
	});

	lab.test("on some non-decline error, the user should receive a message", function(done) {

		var options = {
			url: 	"/payment",
			method: "POST",
			credentials: {
				name: "blahblah"
			},
			payload: {
				stripeToken: "worsetoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.message, "error", "that notifies them that there has been an error");
			assert.include(response.message, "database error", "that outlines the error with adequate specificity");
			done();
		});
	});

	lab.test("if successful, the details of the transaction should be stored in the database", function(done) {

		var options = {
			url: 	"/payment",
			method: "POST",
			credentials: {
				name: "blahblah"
			},
			payload: {
				stripeToken: "goodtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.statusCode, 302, "they should get a FOUND status code (302)");
			assert.include(response.payload, "success!", "that informs them of the successful payment with adequate specificity");
			assert.include(response.headers.location, "/account", "that refreshes their account page");
			done();
		});
	});
});

lab.experiment("When a user tries to visit the admin page, ", function() {
	lab.test("they should be ruthlessly evacuated from the premises", function(done) {
		done();
	});
});

lab.experiment("When the admin visits the admin dashboard, ", function() {
	lab.test("they should be able to see a list of members, their status in the space, and their monthly rent", function(done) {
		done();
	});
	lab.test("they should be able to email an individual or group", function(done) {
		done();
	});
	lab.test("they should be able to authorise new members, ", function(done) {
		done();
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
			payload : {
				firstname: "Sarah",
      			email: "sarahabimay@gmail.com"
			},
			credentials: {
				username 	: "Timmy Tester",
				displayname	: "bigboy1101",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
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
