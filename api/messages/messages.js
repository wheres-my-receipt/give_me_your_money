var config 	= require('../config.js');
var api_key = config.mailgunTest.apiKey;
var domain 	= config.mailgunTest.domain;
var port = {port: (process.env.port || 3000 ) };
//var proxy 	= config.mailgunTest.proxy + port;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var allMembersList = config.mailgunTest.mailLists.allMembersList;
var deskOccupantsList = config.mailgunTest.mailLists.deskOccupantsList;

var messageTemplates = {
	acknowledge : function (message, data) {
		 message.subject = "Welcome to Founders & Coders!";
		 message.text =  "Hello " + data.first_name + "! Thank you for joining Founders and Coders! We will be in touch to verify your account very shortly!";
		 return message;
	},
	verifyAccount: function (message, data) {
		message.subject = "Account Verified";
		message.text = "Hello " + data.first_name + ". Your account has now been verified and you can now rent a desk!";
		return message;
	},
	annualSubscriptionReminder : function (message, data) {
		message.subject = "Annual Fee Almost Due. " + data.subject;
		message.text = "Hello" + data.first_name + ". ";
		message.text += data.contents;
		return message;
	},
	annualSubscriptionDemand : function (message, data) {
		message.subject = "Annual Subscription Expired";
		message.text = "Hello " + data.first_name + ". Your annual subscription has expired. Please visit your account <URL> to renew.";
		return message;
	},
	annualSubscriptionOverdue : function (message, data) {
		message.subject = "Annual Subscription Overdue";
		message.text = "Hello " + data.first_name + ". Your annual subscription expired a week ago. Please visit your account <URL> to renew. No further reminders will be sent!";
		return message;
	},
	deskRentalPaymentReminder : function (message, data) {
		message.subject = "Desk Rental Reminder. " + data.subject;
		message.text = "Hello" + data.first_name + ". ";
		message.text += data.contents;
	},
	customMessage : function (message, data) {
		message.subject = data.subject;
		message.text = data.subject;
		return message;
	}
	// etc..
};

createMessage = function( emailType, data ){
	var message = {
					from: 'facmembershipadmin@gmail.com',
					to: data.email
				};
	switch( emailType ){
		case "Acknowledge" :
			return messageTemplates.acknowledge( message, data );
		case "VerifyAccount" :
			return messageTemplates.verifyAccount( message, data );
		case "AnnualFeeReminder" :
			return messageTemplates.annualSubscriptionReminder( message, data );
		case "DeskRentFeeReminder" :
			return messageTemplates.deskRentalPaymentReminder( message, data );
		case "annualSubscriptionDemand" :
			return messageTemplates.annualSubscriptionDemand( message, data );
		case "annualSubscriptionOverdue" :
			return messageTemplates.annualSubscriptionOverdue( message, data );
		default:
			console.log( "Email Type not found so send custom message: " + emailType );
			return messageTemplates.customMessage( message, data );
	}
};

module.exports = {

	addToMembersList : function( data ){
		// == ADD NEW ACCOUNT MEMBER TO "all_members" EMAIL LIST
		var list = mailgun.lists(allMembersList);

		// list.info(function (err, data) {
		//   // `data` is mailing list info
		//   if( err )
		//   	console.log( "Error: " + err );
		//   else
		//   	console.log(data);
		// });
		var newMember = {
				subscribed: true,
				address: data.email,
				name: data.first_name + ' ' + data.last_name
		};

		list.members().create( newMember, function (err, data) {

			if( err )
				console.log("Created Error: " + err);
			else
				console.log("Created: " + data);

			list.members().list(function (err, members) {
				if( err )
					console.log("Created Error: " + err);
				else// `members` is the list of members
					console.log("addToMembersList (" + members.length + ')');
			});
		});
	},
	addToDeskOccupantsList : function ( data ) {
		// == ADD NEW ACCOUNT MEMBER TO "all_members" EMAIL LIST
		var list = mailgun.lists( deskOccupantsList );
		var newMember = {
				subscribed: true,
				address: data.email,
				name: data.first_name + ' ' + data.last_name
		};

		list.members().create( newMember, function (err, data) {
			// `data` is the member details
			if( err )
				console.log("Created Error: " + err);
			else
				console.log("Created: " + data);
		});
	},

	sendEmail: function(data, emailtype, onComplete){
		// ==== SEND AN EMAIL (e.g. ACKNOWLEDGEMENT TO NEW MEMBER) == //
		var message = createMessage(emailtype, data );
		console.log( 'Message: ' + JSON.stringify( message ) );
		mailgun.messages().send(message, function (error, body) {
			if( error ) {
				console.log( "Error from mailgun: " + error );
				onComplete( error );
			}
			else {
				console.log( "Sent email: " + body);
				onComplete( null, message, body );
			}
		});
	},
};
