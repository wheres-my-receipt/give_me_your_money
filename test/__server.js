var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");
var mongoose 	= require("mongoose");
var server		= require("../api/server.js");
var Schema 		= require("../api/models/schema.js");
var Mocks 		= require("./mocks/accountMocks.js");

// Authentication and routing testing
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
			done();
		});
	});
});

lab.experiment("When a user visits the login page", function() {

	lab.test("without proper authentication, ", function(done) {

		var options = {
			method: "GET",
			url: "/login"
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, "they should get a FOUND status code (302)");
			assert.include(response.headers.location, "https://github.com/login/oauth", "they should be redirected to the login page");
			done();
		});
	});

	lab.test("if already authenticated, ", function(done) {

		var options = {
			url 		: "/login",
			method 		: "GET",
			credentials : {
				username 	: "Timmy Tester",
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
			assert.equal(response.headers.location, "/signup", "they should be redirected to the account page");
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
			assert.equal(response.headers.location, "/", "they should be redirected to the home page");
			done();
		});
	});

	lab.test("with proper authentication, they should be able to register as a user, ", function(done) {

		var options = {
			method: "GET",
			url: "/signup",
			credentials : {
				username 	: "Timmy Tester",
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

	lab.test("with proper authentication, as an already registered user, ", function(done) {

		var options = {
			method: "GET",
			url: "/signup",
			credentials : {
				username 	: "TIMMY",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, " they should get a FOUND status code (302)");
			assert.equal(response.headers.location, "/account", "they should be redirected to their account page");
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
	var database;

	lab.before(function(done) {
		mongoose.connect("mongodb://localhost:27017/test", function(err, db) {
			if (err) throw err;
			database = mongoose.connection;
			done();
		});
	});

	lab.after(function(done) {
		database.close(function(err, db) {
			if (err) throw err;
			done();
		});
	});

	lab.test("without proper authentication, ", function(done) {

			var options = {
				method: "GET",
				url: "/account"
			};
			server.inject(options, function(response) {
				assert.equal(response.statusCode, 302, "they should get a FOUND status code (302)");
				assert.equal(response.headers.location, "/", "they should be redirected to the home page");
				done();
			});
		});

	lab.test("with proper authentication, as an unregistered user, ", function(done) {

		var options = {
			method: "GET",
			url: "/account",
			credentials : {
				username 	: "Timmy Tester",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, " they should get a FOUND status code (302)");
			assert.equal(response.headers.location, "/signup", "they should be redirected to the signup page");
			done();
		});
	});

	lab.test("with proper authentication, as an already registered user, ", function(done) {

		var options = {
			method: "GET",
			url: "/account",
			credentials : {
				username 	: "TIMMY",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3",
				url 		: "https://github.com/MIJOTHY"
			}
		};
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
			assert.include(response.headers["content-type"], "text/html", "they should get an html page back");
			done();
		});
	});

	lab.test("They should be able to pay for their membership", function(done) {
		done();
	});

	lab.test("They should be able to pay for their desk rental", function(done) {
		done();
	});
});

// Testing payment
lab.experiment("Paying for membership, ", function() {

	lab.before(function(done) {
		mongoose.connect("mongodb://localhost:27017/test", function(err, db) {
			if (err) throw err;
			database = mongoose.connection;
			done();
		});
	});

	lab.after(function(done) {
		database.close(function(err, db) {
			if (err) throw err;
			done();
		});
	});

	lab.test("on a card decline, the user should receive an error message", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
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
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
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
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
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

	lab.test("if successful, and the user doesn't have an existing membership", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
			},
			payload: {
				stripeToken: "goodtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.statusCode, 302, "they should get a FOUND status code (302)");
			// gives them a membership for a year
			// sets their active status to true
			assert.include(response.payload, "success!", "that informs them of the successful payment with adequate specificity");
			assert.include(response.headers.location, "/account", "that refreshes their account page");
			done();
		});
	});

	lab.test("if successful, and the user had an expired membership", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
			},
			payload: {
				stripeToken: "goodtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.statusCode, 302, "they should get a FOUND status code (302)");
			// gives them a membership for a year from today
			// sets their active status to true
			assert.include(response.payload, "success!", "that informs them of the successful payment with adequate specificity");
			assert.include(response.headers.location, "/account", "that refreshes their account page");
			done();
		});
	});

	lab.test("if successful, and the user already has an existing membership", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
			},
			payload: {
				stripeToken: "goodtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.statusCode, 302, "they should get a FOUND status code (302)");
			// extends their membership by a year
			assert.include(response.payload, "success!", "that informs them of the successful payment with adequate specificity");
			assert.include(response.headers.location, "/account", "that refreshes their account page");
			done();
		});
	});
});

lab.experiment("Paying for desk rental, ", function() {

	lab.before(function(done) {
		mongoose.connect("mongodb://localhost:27017/test", function(err, db) {
			if (err) throw err;
			database = mongoose.connection;
			done();
		});
	});

	lab.after(function(done) {
		database.close(function(err, db) {
			if (err) throw err;
			done();
		});
	});

	lab.test("if the user has not yet been authorized for desk rental", function(done) {
		var options;
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 401, "they should get an UNAUTHORISED status code (401)");
		});
	});

	lab.test("on a card decline, the user should receive an error message", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
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
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
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
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
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

	lab.test("if successful, and the user doesn't have an existing membership", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
			},
			payload: {
				stripeToken: "goodtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.statusCode, 302, "they should get a FOUND status code (302)");
			// gives them a membership for a year
			// sets their active status to true
			assert.include(response.payload, "success!", "that informs them of the successful payment with adequate specificity");
			assert.include(response.headers.location, "/account", "that refreshes their account page");
			done();
		});
	});

	lab.test("if successful, and the user had an expired membership", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
			},
			payload: {
				stripeToken: "goodtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.statusCode, 302, "they should get a FOUND status code (302)");
			// gives them a membership for a year from today
			// sets their active status to true
			assert.include(response.payload, "success!", "that informs them of the successful payment with adequate specificity");
			assert.include(response.headers.location, "/account", "that refreshes their account page");
			done();
		});
	});

	lab.test("if successful, and the user already has an existing membership", function(done) {

		var options = {
			url: 	"/payment/membership",
			method: "POST",
			credentials: {
				username: "blahblah"
			},
			payload: {
				stripeToken: "goodtoken"
			}
		};

		server.inject(options, function(response) {
			assert.include(response.statusCode, 302, "they should get a FOUND status code (302)");
			// extends their membership by a year
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
lab.experiment("Testing the JSON API 1 - The Authorized User: ", function() {

	lab.before(function(done) {
		mongoose.connect("mongodb://localhost:27017/test", function(err, db) {
			if (err) throw err;
			database = mongoose.connection;
			database.once("open", function() {
		    	console.log("database connection succesful");
			});

			done();
		});
	});

	lab.after(function(done) {
		database.close(function(err, db) {
			if (err) throw err;
			console.log("done");
			done();
		});
	});


	lab.test("Sending a GET request to /accounts", function(done) {

		var options = {
			url: "/accounts",
			method: "GET",
			credentials: {
				username 	: "Timmy Tester",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			// The response should equal an array of the pushed users to db
			done();
		});
	});

	lab.test("Sending a POST request to /accounts", function(done) {

		var options = {
			url: "/accounts",
			method: "POST",
			payload : {
				first_name: "Sarah",
				last_name: "Farage",
				phone_number: "07665443221",
      			email: "sarahabimay@gmail.com"
			},
			credentials: {
				username 	: "Timmy Tester",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
			// The response contents should contain the contents of the posted user
			done();
		});
	});

	lab.test("Sending a GET request to /accounts/{member}, your own account", function(done) {

		var options = {
			url: "/accounts/bigboy1101",
			method: "GET",
			credentials: {
				username 	: "Timmy Tester",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "they should get an OK status code (200)");
			// The response contents should contain the details used to create the user
			done();
		});
	});

	lab.test("Sending a PUT request to /accounts/{member}, your own account", function(done) {

		var options = {
			url: "/accounts/bigboy1101",
			method: "PUT",
			credentials: {
				username 	: "Timmy Tester",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, "they should get an OK status code (200)");
			// The response contents should contain the updated user details
			// The resonse contents should not contain the overwritten details
			done();
		});
	});

	lab.test("Sending a DELETE request to /accounts/{member}, your own account", function(done) {
		var options = {
			url: "/accounts",
			method: "DELETE",
			credentials: {
				username 	: "Timmy Tester",
				email 		: "timothyandthecrew@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 302, "they should get a FOUND status code (200)");
			assert.equal(response.headers.location, "/logout", "they should be redirected to the logout page");
			// The user should no longer exist in the database
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
