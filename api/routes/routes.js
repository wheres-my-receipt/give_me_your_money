var controller 	= require("../controllers/controller.js");

module.exports 	= [

	// STATIC FILES
	{path: "/", 						method: "GET", 		config: controller.home},
	// {path: "/signup", 					method: "GET", 		config: controller.signup},
	{path: "/logout", 					method: "GET",		config: controller.logout },

	// {path: "/admin", 					method: "GET", 		config: controller.admin},
	// {path: "/admin/member/{memberid}", 	method: "GET",		config: controller.getMember},

	// {path: "/account", 					method: "GET", 		config: controller.account},
	// {path: "/account/messages", 			method: "GET", 		config: controller.messages},

	{path: "/{param*}", 				method: "GET", 		config: controller.statics},

	// Payment
	{path: "/payment", 					method: "POST", 	config: controller.payment},
	// JSON API
	{path: "/accounts", 				method: "GET", 		config: controller.getAccounts},
	{path: "/accounts", 				method: "POST",  	config: controller.createAccount},

	{path: "/accounts/{member}", 		method: "GET", 		config: controller.getSingleAccount},
	{path: "/accounts/{member}", 		method: "PUT",  	config: controller.updateSingleAccount},
	{path: "/accounts/{member}", 		method: "DELETE", 	config: controller.deleteSingleAccount},
];
