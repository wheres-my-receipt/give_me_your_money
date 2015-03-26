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
	},
	annualSubscriptionReminder : function (message, data) {

	},
	deskRentalPaymentReminder : function (message, data) {

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
		case "acknowledge" :
			return messageTemplates.acknowledge( message, data );
		case "verifyAccount" :
			return messageTemplates.verifyAccount( message, data );
		case "annualSubscriptionReminder" :
			return messageTemplates.annualSubscriptionReminder( message, data );
		case "deskRentalPaymentReminder" :
			return messageTemplates.deskRentalPaymentReminder( message, data );
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

	sendEmail: function( data, onComplete ){
		// ==== SEND AN EMAIL ACKNOWLEDGEMENT TO NEW MEMBER == //

		var message = createMessage( data.emailType, data );
		mailgun.messages().send(message, function (error, body) {
			if( error ) {
				console.log( "Error: " + error );
				onComplete( error );
			}
			else {
				console.log( "Sent email: " + body);
				onComplete( null, body );
			}
		});
	}
};
