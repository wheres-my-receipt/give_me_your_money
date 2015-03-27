/* TESTING SCHEME

// STATIC FILES
{path: "/", 							method: "GET", 		config: controller.homeView},
	UNAUTHORISED
	COOKIE AUTHORISED

{path: "/login", 						method: "GET", 		config: controller.login},
	UNAUTHORISED
	COOKIE AUTHORISED
	GITHUB AUTHORISED

{path: "/logout", 						method: "GET",		config: controller.logout },
	UNAUTHORISED
	COOKIE AUTHORISED

{path: "/signup", 						method: "GET", 		config: controller.signupView},
	UNAUTHORISED
	COOKIE AUTHORISED & NEW USER
	COOKIE AUTHORISED & ALREADY SIGNED UP

{path: "/admin", 						method: "GET", 		config: controller.adminView},
{path: "/admin/member/{member}", 		method: "GET",		config: controller.memberView},

{path: "/{file*}",						method: "GET",		config: controller.serveFile},
	EXISTING FILE
	NONEXISTANT FILE
	SERVER JS FILE

{path: "/account", 						method: "GET", 		config: controller.accountView},
	UNAUTHORISED
	COOKIE AUTHORISED
		DESCRIBE MY USER CORRECTLY
		EDIT
		DELETE
		MEMBERSHIP PAYMENT
		DESK PAYMENT
			CURRENTLY UNPAID - DESK PAYMENT BUTTON
			CURRENTLY PAID - NO DESK PAYMENT BUTTON
			CURRENTLY AWAY - NO DESK PAYMENT BUTTON

{path: "/account/messages", 			method: "GET", 		config: controller.messagesView},

// Payment
{path: "/payment/{type}", 				method: "POST", 	config: controller.payment},
	UNAUTHORISED
	AUTHORISED
		MEMBERSHIP
			INACTIVE
			ALREADY PAID
		DESK
			D_UNAUTHORISED
			D_AUTHORISED
				CURRENTLY PAID - REJECT
				CURRENTLY UNPAID - ACCEPT, BASED ON TIER
				CURRENLY AWAY - ACCEPT, BASED ON TIER

// JSON API
{path: "/api/accounts", 				method: "GET", 		config: controller.getAccounts},
	UNAUTHORISED
	AUTHORISED

{path: "/api/accounts", 				method: "POST",  	config: controller.createAccount},
	UNAUTHORISED
	AUTHORISED
		ALREADY REGISTERED
		NOT REGISTERED

{path: "/api/accounts/{member}", 		method: "GET", 		config: controller.getAccount},
	UNAUTHORISED
	AUTHORISED

{path: "/api/accounts/{member}", 		method: "PUT",  	config: controller.updateAccount},
	UNAUTHORISED
	AUTHORISED
		OWN ACCOUNT
			VALID FIELDS
			INVALID FIELDS
		OTHER ACCOUNT
			VALID FIELDS
			INVALID FIELDS
		NONEXISTANT ACCOUNT

{path: "/api/accounts/{member}", 		method: "DELETE", 	config: controller.deleteAccount},
	UNAUTHORISED
	AUTHORISED
		OWN ACCOUNT
		OTHER ACCOUNT
		NONEXISTANT ACCOUNT

{path: "/api/messages/{member}",		method: "POST",		config: controller.createMessage},
	UNAUTHORISED
	AUTHORISED
		OWN ACCOUNT
		OTHER ACCOUNT
		NONEXISTANT ACCOUNT

*/
