var mongoose = require("mongoose");
var Schema 	 = mongoose.Schema;

var messageSchema = new Schema({
	to: {type: String, required: true},
	from: {type: String, required: true},
	date: {type: Object, required: true},
	subject: {type: String, required: true},
	text: {type: String, required: true},
});

var transactionSchema = new Schema({
	name:   {type: String, required: true},
	date:   {type: Date, required: true},
	amount: {type: String, required: true},
	type:   {type: String, required: true}
});

var deskRentalSchema = new Schema({
	0:  {type: String, required: true, default: "unpaid"},
	1:  {type: String, required: true, default: "unpaid"},
	2:  {type: String, required: true, default: "unpaid"},
	3:  {type: String, required: true, default: "unpaid"},
	4:  {type: String, required: true, default: "unpaid"},
	5:  {type: String, required: true, default: "unpaid"},
	6:  {type: String, required: true, default: "unpaid"},
	7:  {type: String, required: true, default: "unpaid"},
	8:  {type: String, required: true, default: "unpaid"},
	9:  {type: String, required: true, default: "unpaid"},
	10: {type: String, required: true, default: "unpaid"},
	11: {type: String, required: true, default: "unpaid"},
});

var accountSchema = new Schema({

	email:        {type: String, required: true, unique: true},
	username:     {type: String, required: true, unique: true},
	first_name:   {type: String, required: true},
	last_name:    {type: String, required: true},
	member_since: {type: Date, required: true},
	phone_number: {type: String, required: true},

	admin_rights : {type: Boolean, required: true, default: false},
	github_link: {type: String, required: true, unique: true},
	github_avatar: {type: String, required: true},

	membership_active_status: {type: Boolean, required: true, default: false}, //currently paid up or not
	membership_paid: {type: Date}, // date membership paid until

	desk_authorization: {type: Boolean, required: true, default: false},

	desk_rental_rate:   {type: Number, required: true, default: 5000}, //rate of desk per month (e.g £50/£100/£200)
	desk_rental_status: {type: Object, required: true, default: {}},

	automated_emails: {	membership_reminder_sent: {type: Boolean, default: false},
						membership_demand_sent: {type: Boolean, default: false},
						membership_overdue_sent: {type: Boolean, default: false},
						desk_unpaid_sent: {type: Boolean, default: false},
						desk_overdue_sent: {type: Boolean, default: false},
						test_sent: {type: Boolean, default: false},
					},

	transaction_history	: [transactionSchema],
	message_history		: [messageSchema]
});

var Account 	= mongoose.model("account", accountSchema, "Accounts");
var Transaction = mongoose.model("transaction", transactionSchema);
var Message 	= mongoose.model("message", messageSchema);
var DeskRental 	= mongoose.model("deskrental", deskRentalSchema);

module.exports = {
	Account 		: Account,
	Transaction 	: Transaction,
	Message 		: Message,
	DeskRental  	: DeskRental,
};