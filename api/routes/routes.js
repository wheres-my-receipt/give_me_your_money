var controller = require("../controllers/controller.js");
var Joi = require( "joi");

module.exports = [
	{path: "/", 						method: "GET", 		config: controller.home},
	{path: "/signup", 					method: "GET", 		config: controller.signup},
	{path: "/account", 					method: "GET", 		config: controller.account},
	{path: "/admin", 					method: "GET", 		config: controller.admin},
	{path: "/account/messages", 		method: "GET", 		config: controller.messages},
	{path: "/logout", 					method: "GET",		config: controller.logout },
	{path: "/admin/member/{memberid}", 	method: "GET",		config: controller.getMember},

	{path: "/accounts", 				method: "GET", 		config: controller.getAccount},
	{path: "/accounts", 				method: "POST",  	config: controller.createAccount},
	{path: "/accounts/{member}", 		method: "GET", 		config: controller.getAccount},
	{path: "/accounts/{member}", 		method: "DELETE", 	config: controller.deleteAccount},
	{path: "/accounts/{member}", 		method: "PUT",  	config: controller.updateAccount},
];
