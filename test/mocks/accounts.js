module.exports = {
	user1: {
		email:        "sirloinsteak@googlemail.com",
		username:     "tonystark",
		first_name:   {type: String, required: true},
		last_name:    {type: String, required: true},
		member_since: {type: Date, required: true},
		phone_number: {type: String, required: true},

		admin_rights : {type: Boolean, required: true, default: false},
		github_link: {type: String, required: true, unique: true},
		github_avatar: {type: String, required: true},

		membership_active_status: {type: Boolean, required: true, default: false},
		membership_paid: {type: Date}, // date paid

		desk_authorization: {type: Boolean, required: true, default: false},

		desk_rental_rate:   {type: Number, required: true, default: 5000}, //rate of desk (e.g 50/100/200)
		desk_rental_status: {type: Object, required: true, default: {}},

		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	},
	user2: {
		email:        {type: String, required: true, unique: true},
		username:     {type: String, required: true, unique: true},
		first_name:   {type: String, required: true},
		last_name:    {type: String, required: true},
		member_since: {type: Date, required: true},
		phone_number: {type: String, required: true},

		admin_rights : {type: Boolean, required: true, default: false},
		github_link: {type: String, required: true, unique: true},
		github_avatar: {type: String, required: true},

		membership_active_status: {type: Boolean, required: true, default: false},
		membership_paid: {type: Date}, // date paid

		desk_authorization: {type: Boolean, required: true, default: false},

		desk_rental_rate:   {type: Number, required: true, default: 5000}, //rate of desk (e.g 50/100/200)
		desk_rental_status: {type: Object, required: true, default: {}},

		transaction_history:  [transactionSchema],
		message_history: [messageSchema]
	}
};
