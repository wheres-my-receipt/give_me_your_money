var mongoose = require("mongoose");
var Schema 	= mongoose.Schema;

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
	membership_paid: {type: String}, // date paid

	desk_authorization: {type: Boolean, required: true},
	desk_active_status: {type: Boolean, required: true},

	desk_rental_rate: {type: Number}, //rate of desk (e.g 50/100/200)


	transaction_history:  {type: Array, required: true}, // each object is a payment - date, amount, type, reference
	message_history: {type: Array} // each object is a message - to, from, date, contents
});

var account = mongoose.model("account", accountSchema, "Accounts");

module.exports = {
	account: account
};
