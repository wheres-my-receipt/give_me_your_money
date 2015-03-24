var controller 	= require("../controllers/controller.js");

module.exports 	= [

	// STATIC FILES
	{path: "/", 						method: "GET", 		config: controller.home},

	{path: "/login", 					method: "GET", 		config: controller.login},
	{path: "/logout", 					method: "GET",		config: controller.logout },
	{path: "/signup", 					method: "GET", 		config: controller.signup},

	{path: "/admin", 					method: "GET", 		config: controller.admin},
	{path: "/admin/member/{memberid}", 	method: "GET",		config: controller.getMember},

	{path: "/{file*}",					method: "GET",		config: controller.serveFile},

	{path: "/account", 					method: "GET", 		config: controller.account},
	{path: "/account/messages", 		method: "GET", 		config: controller.messages},

	// JSON API
	{path: "/accounts", 				method: "GET", 		config: controller.getAccounts},
	{path: "/accounts", 				method: "POST",  	config: controller.createAccount},

	{path: "/accounts/{member}", 		method: "GET", 		config: controller.getAccount},
	{path: "/accounts/{member}", 		method: "PUT",  	config: controller.updateAccount},
	{path: "/accounts/{member}", 		method: "DELETE", 	config: controller.deleteAccount},
];
