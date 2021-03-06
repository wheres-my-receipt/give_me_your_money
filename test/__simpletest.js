var lab    		= exports.lab = require("lab").script();
var assert 		= require("chai").assert;
var Hapi   		= require("hapi");
var server		= require("../api/server.js");

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

	lab.test("Sending a POST request to /messages/{member}", function(done) {

		var options = {
			url: "/messages/sarahabimay",
			method: "POST",
			payload : {
				emailType : 'simpleMessage',
				email : 'sarahabimay@gmail.com',
				username : "sarahabimay",
				first_name : "Sarah",
				last_name : "Johnston",
				subject : "TESTING THIS WORKS",
				text : "IS THIS WORKING??",
				firstname: "Sarah"
			},
			credentials: {
				username 	: "Adrian Admin",
				displayname	: "iamincontrol01",
				email 		: "upstairsguys@testing.com",
				avatar 		: "https://avatars1.githubusercontent.com/u/10106320?v=3&s=40",
				url 		: "https://github.com/MIJOTHY"
			}
		};

		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, " they should get an OK status code (200)");
			done();
		});
	});
});
