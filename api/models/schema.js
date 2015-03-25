var mongoose = require("mongoose");
var Schema 	= mongoose.Schema;

var messageSchema = new Schema({
	to: {type: String, required: true},
	from: {type: String, required: true},
	date: {type: Date, required: true},
	subject: {type: String, required: true},
	contents: {type: String, required: true},
});

var transactionSchema = new Schema({
	name: {type: String, required: true},
	date: {type: Date, required: true},
	amount: {type: String, required: true},
});

var accountSchema = new Schema({

	email: {type: String, required: true, unique: true},
	username: {type: String, required: true, unique: true},
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	member_since: {type: Date, required: true},
	phone_number: {type: Number, required: true},

	github_link: {type: String, required: true, unique: true},
	github_avatar: {type: String, required: true},

	membership_active_status: {type: Boolean, required: true},
	membership_paid: {type: Date}, // date paid
	membership_reminder_sent: {type: Boolean}, //these three booleans need to be set to false when payment received
	membership_demand_sent: {type: Boolean},
	membership_overdue_sent: {type: Boolean},

	desk_authorization: {type: Boolean, required: true},

	desk_rental_rate: {type: Number}, //rate of desk (e.g 50/100/200)

	transaction_history:  [transactionSchema],
	message_history: [messageSchema]
});

var Account 	= mongoose.model("account", accountSchema, "Accounts");
var Transaction = mongoose.model("transaction", transactionSchema);
var Message 	= mongoose.model("message", messageSchema);

module.exports = {
	Account: Account,
	Transaction: Transaction,
	Message : Message
};

// NB minimum billing period will be 1 month
/* NOTE - After speaking to dan, he mentioned it might be easier and wiser to adopt a system along the lines
of the following:
Each member has 3 possible payment statuses for any given desk rental month - "Away", "Unpaid", or "Paid"
So each member would 'mark' their status for the month (away or not), and could be chased up accordingly.

userMonths = {
	2015: {
		jan: "paid",
		feb: "away"
		mar: "unpaid"
		...
	},
	2016, {
		jan: "paid"
		...
	}
*/
