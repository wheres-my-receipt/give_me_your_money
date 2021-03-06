var config 	= require('../config.js');
var accounts = require("../models/accounts.js");
var api_key = config.mailgunTest.apiKey;
var domain 	= config.mailgunTest.domain;
var port = {port: (process.env.port || 3000 ) };
//var proxy 	= config.mailgunTest.proxy + port;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var allMembersList = config.mailgunTest.mailLists[0];
var deskOccupantsList = config.mailgunTest.mailLists[1];
var mailLists = config.mailgunTest.mailLists;

var messageTemplates = {
	acknowledge : function (message, data) {
		 message.subject = "Welcome to Founders & Coders!";
		 message.text =  "Hello " + data.first_name + "!\n\n Thank you for joining Founders and Coders! We will be in touch to verify your account very shortly!";
		 return message;
	},
	paymentReceipt : function (message, data) {
		 message.subject = "Thank you for your payment!";
		 message.text =  "Hello " + data.first_name + "!\n\n Thank you for your payment!";
		 return message;
	},
	verifyAccount: function (message, data) {
		message.subject = "Account Verified";
		message.text = "Hello " + data.first_name + ".\n\n Your account has now been verified and you can now rent a desk!";
		return message;
	},
	adminRights: function (message, data) {
		message.subject = "Admin rights granted";
		message.text = "Hello " + data.first_name + ". You have been granted administrator rights!";
		return message;
	},
	annualSubscriptionCustomReminder : function (message, data) {
		message.subject = "Annual Subscription Reminder. " + data.subject;
		message.text = "Hello " + data.first_name + ".\n\n ";
		message.text += data.contents;
		return message;
	},
	deskRentalCustomReminder : function (message, data) {
		message.subject = "Desk Rental Reminder. " + data.subject;
		message.text = "Hello " + data.first_name + ".\n\n ";
		message.text += data.contents;
		return message;
	},
	customMessage : function (message, data) {
		message.subject = data.subject;
		message.text = data.contents;
		return message;
	},

	// AUTOMATED MAILS. please DO NOT ADD subject/content editing.
	annualSubscriptionReminder : function (message, data) {
		message.subject = "Annual Fee Almost Due.";
		message.text = "Hello " + data.first_name + ".\n\n Your annual subscription will expire in one week.";
		return message;
	},
	annualSubscriptionDemand : function (message, data) {
		message.subject = "Annual Subscription Expired";
		message.text = "Hello " + data.first_name + ".\n\n Your annual subscription has expired. Please visit your account <URL> to renew.";
		return message;
	},
	annualSubscriptionOverdue : function (message, data) {
		message.subject = "Annual Subscription Overdue";
		message.text = "Hello " + data.first_name + ".\n\n Your annual subscription expired a week ago. Please visit your account <URL> to renew. No further reminders will be sent!";
		return message;
	},
	deskRentalUnpaid : function (message, data) {
		message.subject = "Desk Rental Unpaid";
		message.text = "Hello " + data.first_name + ".\n\n Your desk rental for this month has not yet been paid. Please visit your account <URL> to pay.";
		return message;
	},
	deskRentalOverdue : function (message, data) {
		message.subject = "Desk Rental Overdue";
		message.text = "Hello " + data.first_name + ".\n\n Your desk rental for this month has not yet been paid. Please visit your account <URL> to pay.";
		return message;
	}
};
getRecipient = function( data ) {
	//  return data.email as if if data.email is already an email address
	console.log( 'Recipient: ' + data.email);
	if( data.email.indexOf( "@") !== -1) return data.email;

	// if no @ then need to look up mail list
	var found = mailLists.filter( function( val, index ) {
		return( val.name === data.email );
	});
	if( found.length === 1 ) {
		console.log( "Found: "+ found[0].email);
		return found[0].email;
	}
	if( found.length === 0 ) console.log( "Didn't find any maillists matching: " + data.email );
	else console.log( "Found too many matching mail lists : " + found);

};

createMessage = function( emailType, data ){
	var message = {
					// from: 'facmembershipadmin@gmail.com',
					from: 'mail@sandbox987b404359ae4e0ab6199bd4e6ad6d2f.mailgun.org',
				};
	message.to = getRecipient( data );
	switch( emailType ){
		case "Acknowledge" :
			return messageTemplates.acknowledge( message, data );
		case "PaymentReceipt" :
			return messageTemplates.paymentReceipt( message, data );
		case "VerifyAccount" :
			return messageTemplates.verifyAccount( message, data );
		case "AdminRights" :
			return messageTemplates.adminRights( message, data );
		case "AnnualSubscriptionFeeReminder" :
			return messageTemplates.annualSubscriptionCustomReminder( message, data );
		case "DeskRentFeeReminder" :
			return messageTemplates.deskRentalCustomReminder( message, data );
		// AUTOMATED EMAILS START HERE
		case "AnnualSubscriptionReminder" :
			return messageTemplates.annualSubscriptionReminder( message, data );
		case "AnnualSubscriptionDemand" :
			return messageTemplates.annualSubscriptionDemand( message, data );
		case "AnnualSubscriptionOverdue" :
			return messageTemplates.annualSubscriptionOverdue( message, data );
		case "DeskRentalUnpaid" :
			return messageTemplates.deskRentalUnpaid( message, data );
		case "DeskRentalOverdue" :
			return messageTemplates.deskRentalOverdue( message, data );
		default:
			console.log( "Email Type not found so send custom message: " + emailType );
			return messageTemplates.customMessage( message, data );
	}
};

module.exports = {
	addToMailList : function ( data, mailListName ) {
		var list = mailgun.lists(mailListName.email );

		var newMember = {
				subscribed: true,
				address: data.email,
				name: data.first_name + ' ' + data.last_name
		};

		if( list ){
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
		}
		else {
			console.log( "Error, cannot find list: " + mailListName.email);
		}
	},
	addToMembersList : function( data ){
		// == ADD NEW ACCOUNT MEMBER TO "all_members" EMAIL LIST
		addToMailList( data, allMembersList );
	},
	addToDeskOccupantsList : function ( data ) {
		// == ADD NEW ACCOUNT MEMBER TO "all_members" EMAIL LIST
		addToMailList(data, deskOccupantsList );
	},
	getAllMailLists : function() {
		return mailLists;
	},
	sendEmail: function(data, emailtype, onComplete){
		// ==== SEND AN EMAIL (e.g. ACKNOWLEDGEMENT TO NEW MEMBER) == //
		var message = createMessage(emailtype, data );
		console.log( 'Message: ' + JSON.stringify( message ) );

		// STICK IT IN THE DATABASE
		accounts.newMessage(data.username, message, function (err, memberDocument, messageId) {
			if (err) {
				return onComplete( err );
			}
			mailgun.messages().send(message, function ( senderror, body) {
				if( senderror ) {
					return accounts.deleteMessage( data.username, messageId, function( error, result ) {
						if( error ) return onComplete( senderror + ": " + error );
						return onComplete( senderror );
					});
				}
				else {
					return onComplete( null, message, memberDocument, body );
				}
			});
		});
	}
};
