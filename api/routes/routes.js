var controller 	= require("../controllers/controller.js");

module.exports 	= [

	// STATIC FILES
	{path: "/", 											method: "GET", 									config: controller.homeView},

	{path: "/login", 										method: "GET", 									config: controller.login},
	{path: "/logout", 										method: ["GET", "PUT", "POST", "DELETE"],		config: controller.logout },
	{path: "/signup", 										method: "GET", 									config: controller.signupView},

	{path: "/admin", 										method: "GET", 									config: controller.adminView},
	{path: "/admin/member/{member}", 						method: "GET",									config: controller.memberView},
	{path: "/admin/message/{member}", 						method: "GET",									config: controller.messageView},

	{path: "/{file*}",										method: "GET",									config: controller.serveFile},

	{path: "/account", 										method: ["GET", "PUT"], 						config: controller.accountView},
	{path: "/account/messages", 							method: "GET", 									config: controller.messagesView},

	// Payment
	{path: "/payment/{type}", 								method: "POST", 								config: controller.payment},

	// JSON API
	{path: "/api/accounts", 								method: "GET", 									config: controller.getAccounts},
	{path: "/api/accounts", 								method: "POST",  								config: controller.createAccount},

	{path: "/api/accounts/{member}", 						method: "GET", 									config: controller.getAccount},
	{path: "/api/accounts/{member}", 						method: "PUT",  								config: controller.updateAccount},
	{path: "/api/accounts/{member}", 						method: "DELETE", 								config: controller.deleteAccount},
	{path: "/api/messages/{member}",						method: "POST",									config: controller.createMessage},

	{path: "/api/accounts/{member}/desk/{year}/{month}", 	method: "PUT",  								config: controller.updateAccountDesk}
];
