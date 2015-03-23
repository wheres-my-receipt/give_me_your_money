var controller = require("../controllers/controller.js");
var Joi = require( "joi");

module.exports = [
	{path: "/", 					method: "GET", 		config: controller.home},
	{path: "/signup", 				method: "GET", 		config: controller.signup},
	{path: "/account", 				method: "GET", 		config: controller.account},
	{path: "/admin", 				method: "GET", 		config: controller.admin},
	{path: "/account/messages", 	method: "GET", 		config: controller.messages},
	{path: "/logout", 				method: "GET",		config: controller.logout },
	{path: "/admin/{member}", 		method: "GET",		config: controller.getMember},
	{path: "/admin/{member}", 		method: "PUT",		config: controller.updateMember},
	{path: "/admin/{member}", 		method: "DELETE",	config: controller.deleteMember},

	{path: "/accounts/{member}", 	method: "GET", 		config: controller.getAccount},
	{path: "/accounts/{member}", 	method: "POST",  	config: controller.createAccount},
	{path: "/accounts/{member}", 	method: "PUT",  	config: controller.updateAccount},
];
